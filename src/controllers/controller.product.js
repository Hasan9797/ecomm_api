import { Sequelize, Op } from 'sequelize';
import dataBase from '../models/model.index.js';
const { Product, SQL } = dataBase;

import { unlinkFile } from '../helpers/fileHelper.js';
import productEnums from '../enums/product_enum.js';

const getAll = async (req, res) => {
	const page = req.query.page;
	const pageSize = req.query.pageSize;

	const limit = pageSize; // Har bir sahifadagi yozuvlar soni
	const offset = (page - 1) * pageSize; // Qaysi yozuvdan boshlab olish

	try {
		// Umumiy yozuvlar sonini olish
		const [countResult] = await SQL.query(
			'SELECT COUNT(*) as count FROM products',
			{
				type: Sequelize.QueryTypes.SELECT,
			}
		);

		if (!countResult || countResult.count == 0) {
			return res.status(404).json({ message: 'Products not found' });
		}
		const count = countResult.count;

		// Sahifalangan yozuvlarni olish
		const rows = await SQL.query(
			`SELECT * FROM products LIMIT :limit OFFSET :offset`,
			{
				replacements: { limit: limit, offset: offset },
				type: Sequelize.QueryTypes.SELECT,
			}
		);

		const totalPages = Math.ceil(count / limit);

		res.status(200).json({
			totalItems: count,
			totalPages: totalPages,
			currentPage: page,
			products: rows,
		});
	} catch (error) {
		return res.status(400).json({
			error: true,
			errorMessage: error.message,
		});
	}
};

const getById = async (req, res) => {
	const product = await Product.findByPk(req.params.id);
	res.status(200).json(product);
};

const getProductsInOrder = async (req, res) => {
	const { productIds } = req.body;

	const uniqueProductIds = [...new Set(productIds)];

	const query = `SELECT * FROM products p WHERE p.id IN (:uniqueProductIds)`;

	const productsWithCategories = await Query.query(query, {
		replacements: { uniqueProductIds },
		type: Sequelize.QueryTypes.SELECT,
	});

	// 3. Har bir ID uchun olingan ma'lumotlarni takrorlanishlarga mos ravishda qayta yig'amiz
	const productsMap = {};
	productsWithCategories.forEach(product => {
		productsMap[product.id] = { ...product, count: 0 };
	});

	productIds.forEach(id => {
		productsMap[id].count += 1;
	});

	const array = [];
	for (const value of Object.values(productsMap)) {
		value.price = value.price * value.count;
		array.push(value);
	}
	res.status(200).json(array);
};

const getProductsByCtegoryId = async (req, res) => {
	const page = req.query.page;
	const pageSize = req.query.pageSize;

	const limit = pageSize; // Har bir sahifadagi yozuvlar soni
	const offset = (page - 1) * pageSize; // Qaysi yozuvdan boshlab olish

	try {
		// Umumiy yozuvlar sonini olish
		const [countResult] = await SQL.query(
			'SELECT COUNT(*) as count FROM products',
			{
				type: Sequelize.QueryTypes.SELECT,
			}
		);
		if (!countResult || countResult.count == 0) {
			return res.status(404).json({ message: 'Products not found' });
		}
		const count = countResult.count;

		// Sahifalangan yozuvlarni olish
		const rows = await SQL.query(
			`SELECT * FROM products WHERE category_id = :categoryId LIMIT :limit OFFSET :offset`,
			{
				replacements: {
					categoryId: req.params.id,
					limit: limit,
					offset: offset,
				},
				type: Sequelize.QueryTypes.SELECT,
			}
		);

		const totalPages = Math.ceil(count / limit);

		res.status(200).json({
			totalItems: count,
			totalPages: totalPages,
			currentPage: page,
			products: rows,
		});
	} catch (error) {
		return res.status(400).json({
			error: true,
			errorMessage: error,
		});
	}
};

const create = async (req, res) => {
	const newProduct = {
		title: req.body.title,
		img: '/' + req.file.filename,
		price: req.body.price,
		description: req.body.description,
		category_id: req.body.category_id,
		status: productEnums.STATUS_CREATE,
	};

	try {
		const product = await Product.create(newProduct);
		res.status(201).json(product);
	} catch (error) {
		return res.status(400).json({
			error: true,
			errorMessage: error,
		});
	}
};

const update = async (req, res) => {
	const newProduct = {
		title: req.body.title,
		price: req.body.price,
		description: req.body.description,
		category_id: req.body.category_id,
		img: req.body.img,
	};

	if (req.file) {
		newProduct.img = '/' + req.file.filename;
		const currentFile = await Product.findByPk(req.body.id);
		const result = unlinkFile([currentFile.img.toString().slice(1)]);
	}

	const product = await Product.update(newProduct, {
		where: { id: req.body.id },
	});
	res.status(200).json(product);
};

const destroy = async (req, res) => {
	const product = await Product.destroy({
		where: { id: req.params.id },
	});
	const currentFile = await Product.findByPk(req.params.id);
	const result = unlinkFile([currentFile.img.toString().slice(1)]);
	console.log(result);
	res.status(200).json(product);
};

export default {
	getAll,
	getById,
	getProductsInOrder,
	getProductsByCtegoryId,
	create,
	update,
	destroy,
};
