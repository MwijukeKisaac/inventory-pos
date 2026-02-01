import React, { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const existing = cart.find((i) => i.id === product.id);

    if (existing) {
      setCart(
        cart.map((i) =>
          i.id === product.id
            ? { ...i, qty: i.qty + 1 }
            : i
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const updateQty = (id, qty) => {
    if (qty === 0) {
      setCart(cart.filter((i) => i.id !== id));
    } else {
      setCart(
        cart.map((i) =>
          i.id === id ? { ...i, qty } : i
        )
      );
    }
  };

  const total = cart.reduce(
    (sum, i) => sum + i.price * i.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQty, total }}
    >
      {children}
    </CartContext.Provider>
  );
}
