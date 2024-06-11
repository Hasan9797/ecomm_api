import { Sequelize, Op } from 'sequelize';
import dataBase from '../models/model.index.js';
const { Order, SQL } = dataBase;

class ReportRepository {
	// constructor(from, to) {}

	async findAllReports(from, to) {
		const allReports = await SQL.query(
			`SELECT * WHERE created_at >= ${from} AND created_at <= ${to}`,
			{
				type: Sequelize.QueryTypes.SELECT,
			}
		);
		const groupByStatus = SQL.query(
			`SELECT * FROM orders
    		 WHERE created_at >= ${from} AND created_at <= ${to}
    		 GROUP BY status`,
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

// 5902160586 tg bot chat_id
