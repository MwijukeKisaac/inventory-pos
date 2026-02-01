import { useEffect, useState } from "react";
import CheckoutModal from "../components/CheckoutModal";
import ReceiptPreview from "../components/ReceiptPreview";

export default function POSScreen() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then(res => res.json())
      .then(setProducts)
      .catch(err => console.error(err));
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <>
      {/* PRODUCTS + CART */}
      <div className="grid grid-cols-3 gap-4">
        {/* PRODUCTS */}
        <div className="col-span-2 grid grid-cols-3 gap-4">
          {products.map(p => (
            <div
              key={p.product_id}
              onClick={() => addToCart(p)}
              className="border p-4 rounded-xl cursor-pointer hover:shadow"
            >
              <h2 className="font-semibold">{p.name}</h2>
              <p>UGX {p.price}</p>
            </div>
          ))}
        </div>

        {/* CART */}
        <div className="bg-gray-100 p-4 rounded-xl">
          <h2 className="font-bold mb-4">Cart</h2>

          {cart.length === 0 && (
            <p className="text-sm text-gray-500">No items added</p>
          )}

          {cart.map((c, i) => (
            <div key={i} className="flex justify-between mb-2">
              <span>{c.name}</span>
              <span>UGX {c.price}</span>
            </div>
          ))}

          <button
            disabled={cart.length === 0}
            onClick={() => setShowCheckout(true)}
            className="mt-4 w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
          >
            Checkout
          </button>
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      {showCheckout && (
        <CheckoutModal
          cart={cart}
          onClose={() => setShowCheckout(false)}
          onSuccess={(data) => {
            setCart([]);
            setShowCheckout(false);

            // 👇 Show receipt preview
            setReceipt({
              receiptNumber: data.receiptNumber,
              totalAmount: data.totalAmount,
              paymentMethod: data.paymentMethod
            });
          }}
        />
      )}

      {/* RECEIPT PREVIEW */}
      {receipt && (
        <ReceiptPreview
          receipt={receipt}
          onClose={() => setReceipt(null)}
        />
      )}
    </>
  );
}
