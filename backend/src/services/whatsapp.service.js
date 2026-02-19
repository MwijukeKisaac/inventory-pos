import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendWhatsAppAlert(message) {
  try {
    await client.messages.create({
      from: process.env.WHATSAPP_FROM,
      to: process.env.ADMIN_WHATSAPP,
      body: message,
    });

    console.log("WhatsApp alert sent");
  } catch (error) {
    console.error("WhatsApp alert failed:", error.message);
  }
}
const axios = require("axios");

exports.sendWhatsAppMessage = async (phone, message) => {
  const url = `https://graph.facebook.com/v19.0/${process.env.PHONE_NUMBER_ID}/messages`;

  await axios.post(
    url,
    {
      messaging_product: "whatsapp",
      to: phone,
      type: "text",
      text: { body: message },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
};
