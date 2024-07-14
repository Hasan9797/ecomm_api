import { Sequelize, Op } from 'sequelize';
import dataBase from '../models/model.index.js';
import order_enum from '../enums/order_enum.js';
const { Order, SQL } = dataBase;

class OrderRepository {
	async findAllOrders(limit, offset, page, filters) {
		try {
			if (filters == {}) {
				// Umumiy orderlar sonini olish
				const countResult = await SQL.query(
					'SELECT COUNT(*) as count FROM orders',
					{
						type: Sequelize.QueryTypes.SELECT,
					}
				);

				if (!countResult || countResult.count == 0) {
					return {
						totalItems: 0,
						totalPages: 0,
						currentPage: 0,
						orders: [],
					};
				}

				const count = countResult[0].count;

				// Sahifalangan orderlarni olish
				const rows = await SQL.query(
					`SELECT * FROM orders
               ORDER BY 
              CASE 
                WHEN status = ${order_enum.STATUS_CREATE} THEN 1
                WHEN status = ${order_enum.STATUS_WAITING} THEN 2
                WHEN status = ${order_enum.STATUS_SUCCESS} THEN 2
                WHEN status = ${order_enum.STATUS_INACTIVE} THEN 4
              ELSE 5
             END
             LIMIT ${limit} OFFSET ${offset};`,
					{
						type: Sequelize.QueryTypes.SELECT,
					}
				);
				const totalPages = Math.ceil(count / limit);

				return {
					totalItems: +count,
					totalPages: totalPages,
					currentPage: page,
					orders: rows,
				};
			}

			// Status orqali orderlar sonini olish
			let sqlQuery = `SELECT * FROM orders WHERE 1=1`;
			let countQuery = `SELECT COUNT(*) as count FROM orders WHERE 1=1`;
			let replacements = [];

			// Query parametrlari orqali filterlarni qo'shish
			for (const key in filters) {
				if (filters.hasOwnProperty(key)) {
					if (key === 'user_name' || key === 'user_number') {
						sqlQuery += ` AND ${key} LIKE ?`;
						countQuery += ` AND ${key} LIKE ?`;
						replacements.push(`%${filters[key]}%`);
					} else if (key === 'from_to') {
						let fromTo = filters[key].split('-');
						if (fromTo.length === 2) {
							sqlQuery += ` AND created_at >= ? AND created_at <= ?`;
							countQuery += ` AND created_at >= ? AND created_at <= ?`;
							replacements.push(parseInt(fromTo[0]), parseInt(fromTo[1]));
						}
					} else {
						sqlQuery += ` AND ${key} = ?`;
						countQuery += ` AND ${key} = ?`;
						replacements.push(filters[key]);
					}
				}
			}

			// COUNT queryni bajarish
			const [countResult] = await SQL.query(countQuery, {
				replacements: replacements,
				type: Sequelize.QueryTypes.SELECT,
			});

			if (!countResult || countResult.count == 0) {
				return {
					totalItems: 0,
					totalPages: 0,
					currentPage: 0,
					orders: [],
				};
			}

			const count = countResult.count;

			// Sahifalangan yozuvlarni olish (oxiridan)
			sqlQuery += ` ORDER BY id DESC LIMIT ? OFFSET ?`;
			replacements.push(limit, offset);

			const rows = await SQL.query(sqlQuery, {
				replacements: replacements,
				type: SQL.QueryTypes.SELECT,
				raw: true,
			});

			const totalPages = Math.ceil(count / limit);

			return {
				totalItems: +count,
				totalPages: totalPages,
				currentPage: page,
				orders: rows,
			};
		} catch (err) {
			console.error(err);
			throw new Error(err.message);
		}
	}

	async findOrderById(orderId) {
		try {
			return await Order.findByPk(orderId);
		} catch (error) {
			console.error(error);
			throw new Error(error.message);
		}
	}

	async createOrder(body) {
		try {
			return await Order.create({
				products: body.products,
				...body,
			});
		} catch (error) {
			console.error(error);
			throw new Error(error.message);
		}
	}

	async updateOrder(orderId, updateData) {
		return await Order.update(updateData, {
			where: { id: orderId },
		});
	}

	async deleteOrder(orderId) {
		return await Order.destroy({
			where: { id: orderId },
		});
	}

	async getSuccessOrder() {
		const now = new Date();

		// 30 kun oldingi vaqtni hisoblash (30 kun * 24 soat * 60 minut * 60 soniya * 1000 millisekund)
		const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

		// UNIX timestamp formatida olish
		const unixThirtyDaysAgo = Math.floor(thirtyDaysAgo.getTime() / 1000);

		// Joriy oyning 1 kuni dan hozirgacha
		const currentMonthStart = new Date();
		currentMonthStart.setDate(1);
		currentMonthStart.setHours(0, 0, 0, 0);
		const currentMonthStartTimestamp = Math.floor(
			currentMonthStart.getTime() / 1000
		);

		const unixNow = Math.floor(now.getTime() / 1000);

		try {
			const products = await Order.findAll({
				where: {
					status: order_enum.STATUS_CREATE,
					created_at: {
						[Sequelize.Op.gte]: currentMonthStartTimestamp,
						[Sequelize.Op.lte]: unixNow,
					},
				},
			});

			if (products.length > 0) {
				return products.map(product => product.get({ plain: true }));
			}

			return [];
		} catch (error) {
			console.error('Unable to connect to the database:', error);
			throw new Error(error);
		}
	}

	async getCreatingOrder() {
		const now = new Date();

		// 30 kun oldingi vaqtni hisoblash (30 kun * 24 soat * 60 minut * 60 soniya * 1000 millisekund)
		const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

		// UNIX timestamp formatida olish
		const unixThirtyDaysAgo = Math.floor(thirtyDaysAgo.getTime() / 1000);

		// Joriy oyning 1 kuni dan hozirgacha
		const currentMonthStart = new Date();
		currentMonthStart.setDate(1);
		currentMonthStart.setHours(0, 0, 0, 0);
		const currentMonthStartTimestamp = Math.floor(
			currentMonthStart.getTime() / 1000
		);

		const unixNow = Math.floor(now.getTime() / 1000);

		try {
			const products = await Order.findAll({
				where: {
					status: order_enum.STATUS_CREATE,
					created_at: {
						[Sequelize.Op.gte]: currentMonthStartTimestamp,
						[Sequelize.Op.lte]: unixNow,
					},
				},
			});

			if (products.length > 0) {
				return products.map(product => product.get({ plain: true }));
			}

			return [];
		} catch (error) {
			console.error('Unable to connect to the database:', error);
			throw new Error(error);
		}
	}
}

export default new OrderRepository();
