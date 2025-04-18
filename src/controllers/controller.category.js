import dataBase from "../models/model.index.js";
import { unlinkFile } from "../helpers/fileHelper.js";
import Errors from "../errors/generalError.js";
import categoryService from "../services/service.category.js";
const { Category } = dataBase;

const getAll = async (req, res, next) => {
  const lang = req.headers["accept-language"] || "uz";
  const { page, pageSize, ...filters } = req.query;
  try {
    const categories = await categoryService.getAll(lang, filters);
    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const category = await categoryService.getById(req.params.id);
    if (category.status === 404) {
      return res
        .status(404)
        .json({ message: category.message, data: category.data });
    }
    return res.status(200).json(category);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const create = async (req, res, next) => {
  const start = Date.now();
  try {
    const { title_uz, title_ru, parentId } = req.body;
    const img = req.file;

    const category = await categoryService.create(
      title_uz,
      title_ru,
      img,
      parentId
    );

    const end = Date.now();

    if (!category) {
      throw new Error(`Cannot create category`);
    }

    res.status(201).json({
      creating: end - start + "ms",
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    console.error(error);
    next(error);
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
        unlinkFile([currentFile.img]);
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
    console.error(error);
    next(error);
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
    console.error(error);
    next(error);
  }
};

export default { getAll, getById, create, update, destroy };
