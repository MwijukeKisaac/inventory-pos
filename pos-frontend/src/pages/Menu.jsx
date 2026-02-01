import { useEffect, useState } from "react";

export default function Menu() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/menu")
      .then(res => res.json())
      .then(setItems);
  }, []);

  const addToCart = (item) => {
    setCart([...cart, { ...item, qty: 1 }]);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🍹 Menu</h1>

      {items.map(item => (
        <div key={item.id} className="border p-3 mb-2 rounded">
          <h2>{item.name}</h2>
          <p>UGX {item.price}</p>
          <button
            className="bg-green-600 text-white px-3 py-1 mt-2"
            onClick={() => addToCart(item)}
          >
            Add
          </button>
        </div>
      ))}

      <a
        href="/checkout"
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full"
      >
        Checkout ({cart.length})
      </a>
    </div>
  );
}
