import dataBase from '../models/model.index.js';
import { unlinkFile } from '../helpers/fileHelper.js';
const { Brand } = dataBase;

const getAll = async (req, res) => {
	const lang = req.headers['accept-language'];
	try {
		const brands = await Brand.findAll();

		if (brands.length <= 0) {
			return res.status(200).json({ message: 'No brands', data: [] });
		}

		const langBrands = brands.map(brand => {
			return {
				id: brand.id,
				name: lang === 'ru' ? brand.name_ru : brand.name_uz,
				img: brand.img,
				link: brand.link,
				createdAt: brand.createdAt,
				updatedAt: brand.updatedAt,
			};
		});
		res.status(200).json({ message: 'Success', data: langBrands });
	} catch (error) {
		throw new Error(error);
	}
};

const getById = async (req, res) => {
	const lang = req.headers['accept-language'];
	try {
		const brand = await Brand.findByPk(req.params.id);

		if (!brand) {
			return res.status(200).json({ message: 'brand not found', data: {} });
		}

		const brandLang = {
			id: brand.id,
			name: lang === 'ru' ? brand.name_ru : brand.name_uz,
			img: brand.img,
			link: brand.link,
			createdAt: brand.createdAt,
			updatedAt: brand.updatedAt,
		};

		res
			.status(200)
			.json({ message: 'Get brand successfully', data: brandLang });
	} catch (error) {
		console.error('Error fetching brand:', error);
		throw new Error(error);
	}
};

const create = async (req, res) => {
	try {
		const { name_ru, name_uz, link } = req.body;
		const img = req.file ? '/' + req.file.filename : null;

		const newBrand = await Brand.create({ name_ru, name_uz, img, link });

		res.status(201).json({ message: 'Created successfully', data: newBrand });
	} catch (error) {
		throw new Error(error);
	}
};

const update = async (req, res) => {
	try {
		const newBrand = {
			...req.body,
		};

		if (req.file) {
			newBrand.img = '/' + req.file.filename;
			const currentFile = await Brand.findByPk(req.query.id);
			if (currentFile && currentFile.img) {
				unlinkFile([currentFile.img.toString().slice(1)]);
			}
		}

		const brand = await Brand.update(newBrand, {
			where: { id: req.query.id },
		});

		if (Brand[0] === 0) {
			return res
				.status(200)
				.json({ message: 'Product not fount', data: brand });
		}
		res.status(200).json({ message: 'Updated Successfully', data: brand });
	} catch (error) {
		throw new Error(error);
	}
};

const destroy = async (req, res) => {
	await Brand.destroy({
		where: { id: req.params.id },
	});
	res.status(200).json({ message: 'Deleted successfully', data: true });
};

export default { getAll, getById, create, update, destroy };
