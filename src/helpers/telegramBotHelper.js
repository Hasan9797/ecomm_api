import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const botToken = process.env.TG_BOT_TOKEN;
const chatId = process.env.TG_CHAT_ID;

async function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text: message,
    parse_mode: "HTML",
  };

  try {
    const response = await axios.post(url, payload);
    if (response.data.ok) {
      console.log("Message sent successfully");
    } else {
      console.error("Error sending message:", response.data.description);
    }
  } catch (error) {
    console.error("Error sending message:", error.message);
  }
}

export default { sendTelegramMessage };
