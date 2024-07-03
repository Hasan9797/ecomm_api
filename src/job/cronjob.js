import tgHelper from "../helpers/telegramBotHelper.js";
import reportAll from "../services/service.reports.js";
import { dateHelper } from "../helpers/dateHelper.js";

const sendDailyReports = async () => {
  const fromDate = Math.floor(Date.now() / 1000) - 84600;
  const toDate = Math.floor(Date.now() / 1000);
  try {
    const usersReports = await reportAll.getUsersReports(fromDate, toDate);

    let message = `<b>Kunlik hisobotlar</b>: ${dateHelper(
      fromDate
    )} <b>dan</b> ${dateHelper(toDate)} <b>gacha</b>\n\n`;
    message += `<b>❗️ОБЩЕЕ КОЛИЧЕСТВО ЗАКАЗОВ</b>:\n<b>🔄 totalOrdersCount</b>: ${usersReports.reportAll.totalOrdersCount}\n<b>💰 totalOrdersAmount</b>: ${usersReports.reportAll.totalOrdersAmount}\n\n`;
    message += `\n\n`;
    message += `<b>❗️ОТЧЕТ ПО СТАТУСАМ ЗАКАЗОВ</b>:\n`;
    usersReports.reportByStatus.forEach((report) => {
      message += `<b>✅ Status</b>: ${report.status}\n<b>💰 Amount</b>: ${report.amount}\n<b>🔄 Count</b>: ${report.count}\n\n`;
    });
    await tgHelper.sendTelegramMessage(message);
    console.log(message);
  } catch (error) {
    console.error("Error sending daily reports:", error);
  }
};

sendDailyReports();
