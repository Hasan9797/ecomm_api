import dataBase from "../models/model.index.js";
import { unlinkFile } from "../helpers/fileHelper.js";
import { dateHelper } from "../helpers/dateHelper.js";
const { Brand } = dataBase;

const getAll = async (req, res, next) => {
  const lang = req.headers["accept-language"];
  try {
    const brands = await Brand.findAll({ raw: true });

    if (brands.length <= 0) {
      return res.status(200).json({ message: "No brands", data: [] });
    }

    const langBrands = brands.map((brand) => {
      return {
        ...brand,
        name: lang === "ru" ? brand.name_ru : brand.name_uz,
        created_at: dateHelper(brand.created_at),
        updated_at: dateHelper(brand.updated_at),
        unixtime: {
          created_unixtime: brand.created_at,
          updated_unixtime: brand.updated_at,
        },
      };
    });
    res.status(200).json({ message: "Success", data: langBrands });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getById = async (req, res, next) => {
  const lang = req.headers["accept-language"];
  try {
    const brand = await Brand.findByPk(req.params.id);

    if (!brand) {
      return res.status(200).json({ message: "brand not found", data: {} });
    }

    const brandLang = {
      ...brand,
      name: lang === "ru" ? brand.name_ru : brand.name_uz,
    };

    res
      .status(200)
      .json({ message: "Get brand successfully", data: brandLang });
  } catch (error) {
    console.error("Error fetching brand:", error);
    console.error(error);
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { name_ru, name_uz, link } = req.body;
    const img = req.file ? "/" + req.file.filename : null;

    const newBrand = await Brand.create({ name_ru, name_uz, img, link });

    res.status(201).json({ message: "Created successfully", data: newBrand });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const newBrand = {
      ...req.body,
    };

    if (req.file) {
      newBrand.img = "/" + req.file.filename;
      const currentFile = await Brand.findByPk(req.params.id);
      if (currentFile && currentFile.img) {
        unlinkFile([currentFile.img]);
      }
    }

    const brand = await Brand.update(newBrand, {
      where: { id: req.params.id },
    });

    if (Brand[0] === 0) {
      return res
        .status(200)
        .json({ message: "Product not fount", data: brand });
    }
    res.status(200).json({ message: "Updated Successfully", data: brand });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const destroy = async (req, res, next) => {
  const currentFile = await Brand.findByPk(req.params.id);
  if (currentFile && currentFile.img) {
    unlinkFile([currentFile.img]);
  }
  await Brand.destroy({
    where: { id: req.params.id },
  });
  res.status(200).json({ message: "Deleted successfully", data: true });
};

export default { getAll, getById, create, update, destroy };
