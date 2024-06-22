import { Sequelize, Op } from "sequelize";
import dataBase from "../models/model.index.js";
const { Product, SQL } = dataBase;

import { unlinkFile } from "../helpers/fileHelper.js";

const getAll = async (req, res) => {
  const page = req.query.page;
  const pageSize = req.query.pageSize;

  const limit = pageSize; // Har bir sahifadagi yozuvlar soni
  const offset = (page - 1) * pageSize; // Qaysi yozuvdan boshlab olish

  try {
    // Umumiy yozuvlar sonini olish
    const [countResult] = await SQL.query(
      "SELECT COUNT(*) as count FROM products",
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (!countResult || countResult.count == 0) {
      return res.status(200).json({ message: "Products not found", data: [] });
    }
    const count = countResult.count;

    // Sahifalangan yozuvlarni olish
    const rows = await SQL.query(
      `SELECT * FROM products LIMIT :limit OFFSET :offset`,
      {
        replacements: { limit: limit, offset: offset },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      message: "Get products successfully",
      totalItems: count,
      totalPages: totalPages,
      currentPage: page,
      data: rows,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const getById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(200).json({ message: "Products not found", data: {} });
    }
    res
      .status(200)
      .json({ message: "Get product successfully", data: product });
  } catch (error) {
    throw new Error(error);
  }
};

const getProductsInOrder = async (req, res) => {
  const { productIds } = req.body;

  const uniqueProductIds = productIds.map((item) => item.id);

  const query = `SELECT * FROM products p WHERE p.id IN (:uniqueProductIds)`;

  try {
    const productsWithCategories = await SQL.query(query, {
      replacements: { uniqueProductIds },
      type: Sequelize.QueryTypes.SELECT,
    });
    console.log(productsWithCategories);

    if (!productsWithCategories || productsWithCategories.length === 0) {
      return res.status(200).json({
        message: "Products not found",
        data: [],
      });
    }
    // 3. Har bir ID uchun olingan ma'lumotlarni takrorlanishlarga mos ravishda qayta yig'amiz
    const productsMap = {};
    productsWithCategories.forEach((product) => {
      productsMap[product.id] = { ...product, count: 0 };
    });

    const array = productIds.map((item) => {
      productsMap[item.id].count = item.count;
      productsMap[item.id].price *= item.count;
      return productsMap[item.id];
    });
    res.status(200).json({ message: "get products successfully", data: array });
  } catch (error) {
    throw new Error(error);
  }
};

const getProductsByCtegoryId = async (req, res) => {
  const page = req.query.page;
  const pageSize = req.query.pageSize;

  const limit = pageSize; // Har bir sahifadagi yozuvlar soni
  const offset = (page - 1) * pageSize; // Qaysi yozuvdan boshlab olish

  try {
    // Umumiy yozuvlar sonini olish
    const [countResult] = await SQL.query(
      "SELECT COUNT(*) as count FROM products",
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    if (!countResult || countResult.count == 0) {
      return res.status(200).json({ message: "Products not found", data: [] });
    }
    const count = countResult.count;

    // Sahifalangan yozuvlarni olish
    const rows = await SQL.query(
      `SELECT * FROM products WHERE category_id = :categoryId LIMIT :limit OFFSET :offset`,
      {
        replacements: {
          categoryId: req.params.id,
          limit: limit,
          offset: offset,
        },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      message: "Get products successfully",
      totalItems: count,
      totalPages: totalPages,
      currentPage: page,
      data: rows,
    });
  } catch (error) {
    throw new Error(error);
  }
};

const create = async (req, res) => {
  const imgFile = req.files["img"] ? req.files["img"][0] : null;
  const galleryFiles = req.files["gallery"] || [];

  const newProduct = {
    ...req.body,
  };

  if (imgFile) {
    newProduct["img"] = "/" + imgFile.filename;
  }

  if (galleryFiles) {
    const gallery = galleryFiles.map(
      (galleryFile) => "/" + galleryFile.filename
    );
    newProduct["gallery"] = gallery;
  }

  try {
    const product = await Product.create(newProduct);
    res
      .status(201)
      .json({ message: "Product created successfully", data: product });
  } catch (error) {
    throw new Error(error);
  }
};

const update = async (req, res) => {
  try {
    const newProduct = {
      ...req.body,
    };

    if (req.file) {
      newProduct[img] = "/" + req.file.filename;
      const currentFile = await Product.findByPk(req.body.id);
      unlinkFile([currentFile.img.toString().slice(1)]);
    }

    const product = await Product.update(newProduct, {
      where: { id: req.body.id },
    });
    res.status(200).json({ message: "Updated successfully", data: product });
  } catch (error) {
    throw new Error(error);
  }
};

const destroy = async (req, res) => {
  try {
    await Product.destroy({
      where: { id: req.params.id },
    });
    const currentFile = await Product.findByPk(req.params.id);
    unlinkFile([currentFile.img.toString().slice(1)]);
    res.status(200).json({ message: "Deleted successfully", data: true });
  } catch (error) {
    throw new Error(error);
  }
};

export default {
  getAll,
  getById,
  getProductsInOrder,
  getProductsByCtegoryId,
  create,
  update,
  destroy,
};
