import { Sequelize, Op } from "sequelize";
import dataBase from "../models/model.index.js";
const { Order, SQL } = dataBase;

class ReportRepository {
  async findAllReports(from, to, limit, offset) {
    const allReports = await SQL.query(
      `SELECT * FROM orders WHERE created_at >= ${from} AND created_at <= ${to}`,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    return allReports;
  }

  async findReportByUserId(categoryId) {
    return await Order.findByPk(categoryId);
  }
}

export default new ReportRepository();
