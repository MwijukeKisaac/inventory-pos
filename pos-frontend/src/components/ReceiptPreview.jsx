import QRCode from "qrcode.react";

export default function ReceiptPreview({ receipt, onClose }) {
  const verifyUrl = `http://localhost:5000/api/receipts/verify/${receipt.receiptNumber}`;
  const pdfUrl = `http://localhost:5000/api/receipts/${receipt.receiptNumber}/pdf`;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-[420px]">
        <h2 className="text-xl font-bold mb-4">Receipt</h2>

        <p><b>Receipt No:</b> {receipt.receiptNumber}</p>
        <p><b>Total:</b> UGX {receipt.totalAmount}</p>
        <p><b>Payment:</b> {receipt.paymentMethod}</p>
        <p className="mb-4">
          <b>Status:</b>
          <span className="text-green-600 font-semibold"> PAID</span>
        </p>

        <div className="flex justify-center mb-4">
          <QRCode value={verifyUrl} size={160} />
        </div>

        <p className="text-xs text-center mb-4">
          Scan QR to verify receipt
        </p>

        <div className="flex justify-between">
          <a
            href={pdfUrl}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            View PDF
          </a>

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
