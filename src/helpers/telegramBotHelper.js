import axios from "axios";
async function sendTelegramMessage(botToken, chatId, message) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const payload = {
    chat_id: chatId,
    text: message,
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

export default sendTelegramMessage;
