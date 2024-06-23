import dataBase from '../models/model.index.js';
import { unlinkFile } from '../helpers/fileHelper.js';
const { Banner } = dataBase;

const getAll = async (req, res) => {
	const lang = req.headers['accept-language'];
	try {
		const banners = await Banner.findAll();

		if (banners.length <= 0) {
			return res.status(200).json({ message: 'No banners', data: [] });
		}

		const langBanner = banners.map(banner => {
			return {
				name: lang === 'ru' ? banner.name_ru : banner.name_uz,
				...banner,
			};
		});
		res.status(200).json({ message: 'Success', data: langBanner });
	} catch (error) {
		throw new Error(error);
	}
};

const getById = async (req, res) => {
	const lang = req.headers['accept-language'];
	try {
		const banner = await Banner.findByPk(req.params.id);

		if (!banner) {
			return res.status(200).json({ message: 'Banner not found', data: {} });
		}
		const langBanner = {
			name: lang === 'ru' ? banner.name_ru : banner.name_uz,
			...banner,
		};
		res
			.status(200)
			.json({ message: 'Get Banner successfully', data: langBanner });
	} catch (error) {
		console.error('Error fetching Banner with subcategories:', error);
		throw new Error(error);
	}
};

const create = async (req, res) => {
	try {
		const { name_ru, name_uz, link } = req.body;
		const img = req.file ? '/' + req.file.filename : null;

		const newBanner = await Banner.create({ name_ru, name_uz, img, link });

		res.status(201).json({ message: 'Created successfully', data: newBanner });
	} catch (error) {
		throw new Error(error);
	}
};

const update = async (req, res) => {
	try {
		const newBanner = {
			...req.body,
		};

		if (req.file) {
			newBanner.img = '/' + req.file.filename;
			const currentFile = await Brand.findByPk(req.query.id);
			if (currentFile && currentFile.img) {
				unlinkFile([currentFile.img.toString().slice(1)]);
			}
		}

		const Banner = await Banner.update(newBanner, {
			where: { id: req.query.id },
		});

		if (Banner[0] === 0) {
			return res
				.status(200)
				.json({ message: 'Product not fount', data: Banner });
		}
		res.status(200).json({ message: 'Updated Successfully', data: Banner });
	} catch (error) {
		throw new Error(error);
	}
};

const destroy = async (req, res) => {
	await Banner.destroy({
		where: { id: req.params.id },
	});
	res.status(200).json({ message: 'Deleted successfully', data: true });
};

export default { getAll, getById, create, update, destroy };
