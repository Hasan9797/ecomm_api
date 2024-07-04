import { dateHelper } from "../helpers/dateHelper.js";
import CategoryRepository from "../repositories/repo.category.js";

const getAll = async (lang) => {
  try {
    const categories = await CategoryRepository.findAllCategorys();

    if (categories.length <= 0) {
      return { status: 404, message: "No categories", data: [] };
    }

    const langCategory = categories
      .sort((a, b) => b.id - a.id)
      .map((category) => ({
        id: category.id,
        title: lang === "ru" ? category.title_ru : category.title_uz,
        img: category.img,
        createdAt: dateHelper(category.createdAt),
        updatedAt: dateHelper(category.updatedAt),
        unixtime: {
          created_unixtime: category.createdAt,
          updated_unixtime: category.updatedAt,
        },
        subcategories: category.subcategories.map((sub) => ({
          id: sub.id,
          title: lang === "ru" ? sub.title_ru : sub.title_uz,
          img: sub.img,
          createdAt: dateHelper(sub.createdAt),
          updatedAt: dateHelper(sub.updatedAt),
          unixtime: {
            created_unixtime: sub.createdAt,
            updated_unixtime: sub.updatedAt,
          },
        })),
      }));

    return { message: "Success", data: langCategory };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getById = async (categoryId) => {
  try {
    const category = await CategoryRepository.findCategoryById(categoryId);

    if (category === null) {
      return { status: 404, message: "No categories", data: {} };
    }

    return { message: "Get category successfully", data: category };
  } catch (err) {
    throw new Error(err.message);
  }
};

const create = async (title_uz, title_ru, photo) => {
  try {
    const newCategory = {
      title_uz,
      title_ru,
      img: photo ? "/" + photo.filename : null,
    };
    return await CategoryRepository.createCategory(newCategory);
  } catch (error) {
    throw new Error(error.message);
  }
};

export default { getAll, getById, create };
