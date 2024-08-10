// @ts-ignore
import cron from "node-cron";

import tgHelper from "../helpers/telegramBotHelper.js";
import reportAll from "../services/service.reports.js";
import { dateHelper } from "../helpers/dateHelper.js";

const allReports = () => {
  const startOfYesterday = new Date();
  startOfYesterday.setDate(startOfYesterday.getDate() - 1); // Kechagi kun
  startOfYesterday.setHours(0, 0, 0, 0); // Kun boshiga o'rnatish

  const fromDate = Math.floor(startOfYesterday.getTime() / 1000);
  const toDate = Math.floor(Date.now() / 1000);

  reportAll
    .getUsersReports(fromDate, toDate)
    .then((usersReports) => {
      let message = `<b>Kunlik hisobotlar</b>: ${dateHelper(
        fromDate
      )} <b>dan</b> ${dateHelper(toDate)} <b>gacha</b>\n\n`;
      message += `<b>❗️ОБЩЕЕ КОЛИЧЕСТВО ЗАКАЗОВ</b>:\n<b>🔄 totalOrdersCount</b>: ${usersReports.reportAll.totalOrdersCount}\n<b>💰 totalOrdersAmount</b>: ${usersReports.reportAll.totalOrdersAmount}\n\n`;
      message += `\n\n`;
      message += `<b>❗️ОТЧЕТ ПО СТАТУСАМ ЗАКАЗОВ</b>:\n`;
      usersReports.reportByStatus.forEach((report) => {
        message += `<b>✅ Status</b>: ${report.status}\n
        <b>💰 Amount</b>: ${report.amount}\n
        <b>🔄 Count</b>: ${report.count}\n\n`;
      });

      return tgHelper.sendTelegramMessage(message);
    })
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error("Error sending daily reports:", error);
    });
};

cron.schedule("*/5 * * * *", () => {
  console.log("Running a task at 12:00 AM every day");
  allReports();
});
// ("0 0 * * *");
