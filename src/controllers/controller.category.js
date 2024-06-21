import dataBase from '../models/model.index.js';
import { unlinkFile } from '../helpers/fileHelper.js';
const { Category } = dataBase;

const getAll = async (req, res) => {
	try {
		const categories = await Category.findAll({
			include: [
				{
					model: Category,
					as: 'subcategories',
				},
			],
		});
		res.status(200).json({ message: 'Success', data: categories });
	} catch (error) {
		throw new Error(error);
	}
};

const getById = async (req, res) => {
	try {
		const category = await Category.findByPk(req.params.id, {
			include: [
				{
					model: Category,
					as: 'subcategories',
				},
				,
			],
		});

		if (!category) {
			return res.status(200).json({ message: 'Category not found', data: {} });
		}

		res
			.status(200)
			.json({ message: 'Get category successfully', data: category });
	} catch (error) {
		console.error('Error fetching category with subcategories:', error);
		throw new Error(error);
	}
};

const create = async (req, res) => {
	try {
		const newCategory = {
			img: '/' + req.file.filename,
			...req.body,
		};
		const category = await Category.create(newCategory);
		res.status(201).json({ message: 'Created successfully', data: category });
	} catch (error) {
		throw new Error(error);
	}
};

const update = async (req, res) => {
	try {
		const newCategory = {
			...req.body,
		};

		if (req.file) {
			newCategory.img = '/' + req.file.filename;
			const currentFile = await Category.findByPk(req.body.id);
			unlinkFile([currentFile.img.toString().slice(1)]);
		}

		const category = await Category.update(newCategory, {
			where: { id: req.query.id },
		});
		res.status(200).json({ message: 'Updated successfully', data: category });
	} catch (error) {
		throw new Error(error);
	}
};

const destroy = async (req, res) => {
	await Category.destroy({
		where: { id: req.params.id },
	});
	res.status(200).json({ message: 'Deleted successfully', data: true });
};

export default { getAll, getById, create, update, destroy };
