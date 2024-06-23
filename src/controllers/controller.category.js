import dataBase from '../models/model.index.js';
import { unlinkFile } from '../helpers/fileHelper.js';
const { Category } = dataBase;

const getAll = async (req, res) => {
	const lang = req.headers['accept-language'];
	try {
		const categories = await Category.findAll({
			include: [
				{
					model: Category,
					as: 'subcategories',
				},
			],
		});

		if (categories.length <= 0) {
			return res.status(200).json({ message: 'No categories', data: [] });
		}

		const langCategory = categories.map(category => {
			return {
				id: category.id,
				title: lang === 'ru' ? category.title_ru : category.title_uz,
				img: category.img,
				createdAt: category.createdAt,
				updatedAt: category.updatedAt,
				subcategories: category.subcategories.map(sub => {
					return {
						id: sub.id,
						title: lang === 'ru' ? sub.title_ru : sub.title_uz,
						img: category.img,
						createdAt: sub.createdAt,
						updatedAt: sub.updatedAt,
					};
				}),
			};
		});
		res.status(200).json({ message: 'Success', data: langCategory });
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
	const start = Date.now();
	try {
		const { title_uz, title_ru } = req.body;

		const img = req.file.img;

		const newCategory = {
			title_uz,
			title_ru,
			img: img ? '/' + img.filename : null,
		};

		const category = await Category.create(newCategory);

		const end = Date.now();
		// console.log(`Category creation took ${end - start}ms`);

		res.status(201).json({
			creating: end - start + 'ms',
			message: 'Category created successfully',
			data: category,
		});
	} catch (error) {
		console.error('Error creating Category:', error);
		res
			.status(500)
			.json({ message: 'Error creating Category', error: error.message });
	}
};

const update = async (req, res) => {
	try {
		const newCategory = {
			...req.body,
		};

		if (req.file) {
			newCategory.img = '/' + req.file.filename;
			const currentFile = await Category.findByPk(req.params.id);
			if (currentFile && currentFile.img) {
				unlinkFile([currentFile.img.toString().slice(1)]);
			}
		}

		const category = await Category.update(newCategory, {
			where: { id: req.params.id },
		});

		if (category[0] === 0) {
			return res
				.status(200)
				.json({ message: 'Category not fount', data: category });
		}
		res.status(200).json({ message: 'Updated Successfully', data: category });
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
