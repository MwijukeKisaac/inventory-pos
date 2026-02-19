const express = require("express");
const router = express.Router();
const { sendWhatsAppMessage } = require("../services/whatsappService");
const { checkStock } = require("../services/inventoryService");

router.post("/webhook", async (req, res) => {
  const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (!msg) return res.sendStatus(200);

  const text = msg.text?.body;
  const phone = msg.from;

  if (text.toLowerCase().startsWith("stock")) {
    const product = text.replace("stock", "").trim();
    const item = await checkStock(product);

    if (!item) {
      await sendWhatsAppMessage(phone, "❌ Product not found");
    } else {
      await sendWhatsAppMessage(
        phone,
        `📦 ${item.name}\nAvailable: ${item.quantity}\n💰 UGX ${item.price}`
      );
    }
  }

  res.sendStatus(200);
});

module.exports = router;
