import dataBase from "../models/model.index.js";
import { unlinkFile } from "../helpers/fileHelper.js";
import Errors from "../errors/generalError.js";
import { dateHelper } from "../helpers/dateHelper.js";
const { Category } = dataBase;

const getAll = async (req, res, next) => {
  const lang = req.headers["accept-language"] || "uz";
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Category,
          as: "subcategories",
          attributes: [
            "id",
            "title_uz",
            "title_ru",
            "img",
            "createdAt",
            "updatedAt",
          ],
        },
      ],
      attributes: [
        "id",
        "title_uz",
        "title_ru",
        "img",
        "createdAt",
        "updatedAt",
      ],
    });

    if (categories.length <= 0) {
      return res.status(200).json({ message: "No categories", data: [] });
    }

    const langCategory = categories
      .sort((a, b) => b.id - a.id)
      .map((category) => ({
        id: category.id,
        title: lang === "ru" ? category.title_ru : category.title_uz,
        img: category.img,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
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

    return res.status(200).json({ message: "Success", data: langCategory });
  } catch (error) {
    throw new Error(error.message);
  }
};

const getById = async (req, res, next) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: "subcategories",
          attributes: [
            "id",
            "title_uz",
            "title_ru",
            "img",
            "createdAt",
            "updatedAt",
          ],
        },
      ],
      attributes: [
        "id",
        "title_uz",
        "title_ru",
        "img",
        "createdAt",
        "updatedAt",
      ],
    });

    if (!category) {
      return Errors.notFound("Category not found");
    }

    return res
      .status(200)
      .json({ message: "Get category successfully", data: category });
  } catch (error) {
    throw new Error(error.message);
  }
};

const create = async (req, res, next) => {
  const start = Date.now();
  try {
    const { title_uz, title_ru } = req.body;
    const img = req.file;

    const newCategory = {
      title_uz,
      title_ru,
      img: img ? "/" + img.filename : null,
    };

    const category = await Category.create(newCategory);

    const end = Date.now();

    return res.status(201).json({
      creating: end - start + "ms",
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const update = async (req, res, next) => {
  try {
    const newCategory = { ...req.body };

    if (req.file) {
      newCategory.img = "/" + req.file.filename;
      const currentFile = await Category.findByPk(req.params.id, {
        attributes: ["img"],
      });
      if (currentFile && currentFile.img) {
        unlinkFile([currentFile.img.toString().slice(1)]);
      }
    }

    const [updated] = await Category.update(newCategory, {
      where: { id: req.params.id },
    });

    if (updated === 0) {
      return Errors.notFound("Category not found");
    }

    return res
      .status(200)
      .json({ message: "Updated Successfully", data: newCategory });
  } catch (error) {
    throw new Error(error.message);
  }
};

const destroy = async (req, res, next) => {
  try {
    const deleted = await Category.destroy({
      where: { id: req.params.id },
    });

    if (deleted === 0) {
      return next(Errors.notFound("Category not found"));
    }

    return res
      .status(200)
      .json({ message: "Deleted successfully", data: true });
  } catch (error) {
    throw new Error(error.message);
  }
};

export default { getAll, getById, create, update, destroy };
