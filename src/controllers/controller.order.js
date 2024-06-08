// Models
import { Sequelize, Op } from 'sequelize';
import dataBase from '../models/model.index.js';
const { Order, SQL } = dataBase;

// Orders
export const getAll = async (req, res) => {
	const page = parseInt(req.query.page) || 1;
	const pageSize = parseInt(req.query.pageSize) || 20;

	const limit = pageSize; // Har bir sahifadagi order soni
	const offset = (page - 1) * pageSize; // Qaysi orderdan boshlab olish

	try {
		// Umumiy orderlar sonini olish
		const countResult = await SQL.query(
			'SELECT COUNT(*) as count FROM orders',
			{
				type: Sequelize.QueryTypes.SELECT,
			}
		);
		if (countResult[0].count > 0) {
			const count = countResult[0].count;

			// Sahifalangan orderlarni olish
			const rows = await SQL.query(
				`SELECT * FROM orders
      			 ORDER BY 
     			 CASE 
        		  WHEN status = 1 THEN 1
       		  	  WHEN status = 2 THEN 2
        		  WHEN status = 3 THEN 3
      			ELSE 4
     			END
     			LIMIT ${limit} OFFSET ${offset};`,
				{
					type: Sequelize.QueryTypes.SELECT,
				}
			);
			const totalPages = Math.ceil(count / limit);

			return res.status(200).json({
				totalItems: +count,
				totalPages: totalPages,
				currentPage: page,
				orders: rows,
			});
		}
		res.status(200).json({
			totalItems: 0,
			totalPages: 0,
			currentPage: 0,
			orders: [],
		});
	} catch (err) {
		return res.status(400).json({
			error: true,
			errorMessage: err.message,
		});
	}
};

export const getById = async (req, res) => {
	const order = await Order.findByPk(req.params.id);
	res.status(200).json(order);
};

export const create = async (req, res) => {
	const order = await Order.create(req.body);
	res.status(201).json(order);
};

export const update = async (req, res) => {
	const order = await Order.update(req.body, {
		where: { id: req.params.id },
	});
	res.status(200).json(order);
};

export const destroy = async (req, res) => {
	const order = await Order.destroy({
		where: { id: req.params.id },
	});
	res.status(200).json(order);
};
