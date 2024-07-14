import { dateHelper } from '../helpers/dateHelper.js';
import CategoryRepository from '../repositories/repo.category.js';

const getAll = async (lang, filters) => {
	try {
		const categories = await CategoryRepository.findAllCategorys(filters);

		if (categories.length <= 0) {
			return { status: 404, message: 'No categories', data: [] };
		}

		const langCategory = categories
			.sort((a, b) => b.id - a.id)
			.map(category => ({
				id: category.id,
				title: lang === 'ru' ? category.title_ru : category.title_uz,
				img: category.img,
				created_at: dateHelper(category.created_at),
				updated_at: dateHelper(category.updated_at),
				unixtime: {
					created_unixtime: category.created_at,
					updated_unixtime: category.updated_at,
				},
				subcategories: category.subcategories.map(sub => ({
					id: sub.id,
					title: lang === 'ru' ? sub.title_ru : sub.title_uz,
					img: sub.img,
					created_at: dateHelper(sub.created_at),
					updated_at: dateHelper(sub.updated_at),
					unixtime: {
						created_unixtime: sub.created_at,
						updated_unixtime: sub.updated_at,
					},
				})),
			}));

		return { message: 'Success', data: langCategory };
	} catch (error) {
		throw new Error(error.message);
	}
};

const getById = async categoryId => {
	try {
		const category = await CategoryRepository.findCategoryById(categoryId);

		if (category === null) {
			return { status: 404, message: 'No categories', data: {} };
		}

		return { message: 'Get category successfully', data: category };
	} catch (err) {
		throw new Error(err.message);
	}
};

const getSubCategoriesInCategory = async categoryId => {
	try {
		const category = await CategoryRepository.findCategoryById(categoryId);

		if (category === null) {
			return { status: 404, message: 'No categories', data: {} };
		}

		const subcategories = category.subcategories.map(sub => sub.id);
		subcategories.push(categoryId);

		return subcategories;
	} catch (err) {
		throw new Error(err.message);
	}
};

const create = async (title_uz, title_ru, photo, parentId) => {
	try {
		const newCategory = {
			title_uz,
			title_ru,
			img: photo ? '/' + photo.filename : null,
			parentId,
		};
		return await CategoryRepository.createCategory(newCategory);
	} catch (error) {
		throw new Error(error.message);
	}
};

const getCategories = async lang => {
	try {
		const categories = await CategoryRepository.getCategories();

		if (categories.length <= 0) {
			return { status: 404, message: 'No categories', data: [] };
		}

		const langCategory = categories
			.sort((a, b) => b.id - a.id)
			.map(category => ({
				id: category.id,
				title: lang === 'ru' ? category.title_ru : category.title_uz,
				img: category.img,
				created_at: dateHelper(category.created_at),
				updated_at: dateHelper(category.updated_at),
				unixtime: {
					created_unixtime: category.created_at,
					updated_unixtime: category.updated_at,
				},
				subcategories: category.subcategories.map(sub => ({
					id: sub.id,
					title: lang === 'ru' ? sub.title_ru : sub.title_uz,
					img: sub.img,
					created_at: dateHelper(sub.created_at),
					updated_at: dateHelper(sub.updated_at),
					unixtime: {
						created_unixtime: sub.created_at,
						updated_unixtime: sub.updated_at,
					},
				})),
			}));

		return { message: 'Success', data: langCategory };
	} catch (error) {
		throw new Error(error.message);
	}
};

export default {
	getAll,
	getCategories,
	getById,
	create,
	getSubCategoriesInCategory,
};
