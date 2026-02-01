import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

const generateReceiptPDF = async (receiptData) => {
  const receiptsDir = path.join("src", "receipts");
  if (!fs.existsSync(receiptsDir)) {
    fs.mkdirSync(receiptsDir, { recursive: true });
  }

  const filePath = path.join(
    receiptsDir,
    `receipt-${receiptData.receipt_number}.pdf`
  );

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  // Header
  doc.fontSize(20).text("INVENTORY POS RECEIPT", {
    align: "center",
  });
  doc.moveDown();

  doc.fontSize(12).text(`Receipt No: ${receiptData.receipt_number}`);
  if (receiptData.order_id) {
    doc.text(`Order ID: ${receiptData.order_id}`);
  }
  doc.text(`Date: ${new Date().toLocaleString()}`);
  if (receiptData.cashier) {
    doc.text(`Cashier: ${receiptData.cashier}`);
  }
  doc.moveDown();

  // Items
  doc.text("Items:");
  receiptData.items.forEach((item) => {
    const subtotal = item.subtotal || (item.price * item.qty);
    doc.text(
      `${item.name} x${item.qty || item.quantity} - UGX ${subtotal}`
    );
  });

  doc.moveDown();
  doc.text(`TOTAL: UGX ${receiptData.total}`, {
    bold: true,
  });

  // QR Code
  const qrData = receiptData.order_id
    ? `RECEIPT:${receiptData.receipt_number}|ORDER:${receiptData.order_id}`
    : `RECEIPT:${receiptData.receipt_number}`;
  const qrImage = await QRCode.toDataURL(qrData);

  doc.image(qrImage, {
    fit: [120, 120],
    align: "center",
  });

  doc.moveDown();
  doc.text("Thank you for your purchase!", {
    align: "center",
  });

  doc.end();

  return filePath;
};

export default generateReceiptPDF;
