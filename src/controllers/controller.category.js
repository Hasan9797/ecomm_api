import dataBase from '../models/model.index.js';
const { Category, Product } = dataBase;

const getAll = async (req, res) => {
	const categories = await Category.findAll({
		include: [
			{
				model: Category,
				as: 'subcategories',
			},
		],
	});
	res.status(200).json(categories);
};

const getById = async (req, res) => {
	try {
		const category = await Category.findByPk(req.params.id, {
			include: [
				{
					model: Category,
					as: 'subcategories',
					include: [
						{
							model: Category,
							as: 'subcategories',
						},
					],
				},
				{
					model: Product,
					as: 'products',
				},
			],
		});

		if (!category) {
			return res.status(404).json({ message: 'Category not found' });
		}

		return res.status(200).json(category);
	} catch (error) {
		console.error('Error fetching category with subcategories:', error);
		return res.status(500).json({ message: 'Internal server error' });
	}
};

const create = async (req, res) => {
	const newCategory = {
		img: '/' + req.file.filename,
		...req.body,
	};
	const category = await Category.create(newCategory);
	res.status(201).json(category);
};

const update = async (req, res) => {
	const newCategory = {
		...req.body,
	};

	if (req.file) {
		newCategory.img = '/' + req.file.filename;
		const currentFile = await Category.findByPk(req.body.id);
		const result = unlinkFile([currentFile.img.toString().slice(1)]);
	}

	const category = await Category.update(newCategory, {
		where: { id: req.body.id },
	});
	res.status(200).json(category);
};

const destroy = async (req, res) => {
	const category = await Category.destroy({
		where: { id: req.params.id },
	});
	res.status(200).json(category);
};

export default { getAll, getById, create, update, destroy };
