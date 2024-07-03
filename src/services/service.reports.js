import order_enum from "../enums/order_enum.js";
import usersRepositorys from "../repositories/repo.reports.js";

const getUserReport = async (from, to, userNumber) => {
  const result = await usersRepositorys.getReportByUser(from, to, userNumber);
  const cleanResult = result.map((record) => record.toJSON());

  const totalReportByStatus = [];
  let totalOrdersCount = 0;
  // All groups by status
  cleanResult.forEach((element) => {
    // orders
    element.orders.forEach((item) => {
      totalOrdersCount++;
      let amount = 0;
      let count = 0;
      // products by order
      item.products.forEach((product) => {
        count += 1;
        amount += product.price;
      });
      // report orders by status
      totalReportByStatus.push({ status: item.status, amount, count });
    });
  });

  let totalOrdersAmount = 0;
  totalReportByStatus.forEach((report) => {
    totalOrdersAmount += report.amount;
  });
  return {
    reportAll: { totalOrdersCount, totalOrdersAmount },
    reportByStatus: totalReportByStatus,
  };
};

const getUsersReports = async (from, to) => {
  try {
    const result = await usersRepositorys.getAllReport(from, to);
    const cleanResult = result.map((record) => record.toJSON());

    const totalReportByStatus = {};
    let totalOrdersCount = 0;

    cleanResult.forEach((element) => {
      element.orders.forEach((item) => {
        totalOrdersCount++;
        // report orders by status
        totalReportByStatus[item.status] = {
          status: order_enum.getStatusName(item.status),
          amount: 0,
          count: 0,
        };
      });

      element.orders.forEach((item) => {
        // products by order
        item.products.forEach((product) => {
          totalReportByStatus[item.status].amount += product.price;
          totalReportByStatus[item.status].count += product.count;
        });
      });
    });

    const array = Object.values(totalReportByStatus);

    let totalOrdersAmount = 0;
    array.forEach((report) => {
      totalOrdersAmount += report.amount;
    });
    return {
      reportAll: { totalOrdersCount, totalOrdersAmount },
      reportByStatus: array,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

export default { getUserReport, getUsersReports };
