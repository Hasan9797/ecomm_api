import { Sequelize, Op } from 'sequelize';
import dataBase from '../models/model.index.js';
const { Order, SQL } = dataBase;

const getOrderStatsGroupedByStatus = async (startDate, endDate) => {
	try {
		const result = await Order.findAll({
			attributes: [
				'status',
				[Sequelize.fn('COUNT', Sequelize.col('id')), 'status_count'],
				[Sequelize.fn('ARRAY_AGG', Sequelize.col('*')), 'orders'],
			],
			where: {
				createdAt: {
					[Op.between]: [startDate, endDate],
				},
			},
			group: ['status'],
		});

		return result;
	} catch (error) {
		console.error('Error fetching order stats:', error);
		throw error;
	}
};

export default getOrderStatsGroupedByStatus();
