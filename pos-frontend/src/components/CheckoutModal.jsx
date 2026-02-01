import { useState } from "react";

export default function CheckoutModal({ cart, onClose, onSuccess }) {
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const total = cart.reduce((sum, i) => sum + Number(i.price), 0);

  const handleCheckout = async () => {
    const response = await fetch("http://localhost:5000/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart,
        paymentMethod
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ Payment successful");
      onSuccess(data);
      onClose();
    } else {
      alert("❌ Payment failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-96">
        <h2 className="text-xl font-bold mb-4">Checkout</h2>

        <p className="mb-2 font-semibold">
          Total: UGX {total}
        </p>

        <label className="block mb-2">Payment Method</label>
        <select
          className="border p-2 w-full mb-4"
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value)}
        >
          <option value="CASH">Cash</option>
          <option value="MTN_MOMO">MTN Mobile Money</option>
          <option value="AIRTEL_MOMO">Airtel Money</option>
        </select>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleCheckout}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}
