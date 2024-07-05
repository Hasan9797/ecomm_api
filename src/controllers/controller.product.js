import { Sequelize, Op } from "sequelize";
import dataBase from "../models/model.index.js";
import GlobalError from "../errors/generalError.js";
import productService from "../services/service.product.js";

const { Product, SQL, Category } = dataBase;

import { unlinkFile } from "../helpers/fileHelper.js";
import Errors from "../errors/generalError.js";
import { dateHelper } from "../helpers/dateHelper.js";

const getAll = async (req, res) => {
  const lang = req.headers["accept-language"];
  const { page, pageSize, ...filters } = req.query;
  try {
    const products = await productService.getAllProducts(
      lang,
      page,
      pageSize,
      filters
    );
    res.status(200).json(products);
  } catch (error) {
    throw new Error(error.message);
  }
};

const getById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(product.status).json(product);
  } catch (error) {
    throw new Error(error.message);
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

    const filterArray = productIds.filter((product) => {
      if (productsMap[product.id]) {
        return product;
      }
    });
    const array = filterArray.map((item) => {
      productsMap[item.id].count = item.count;
      productsMap[item.id].price *= item.count;
      return productsMap[item.id];
    });
    res.status(200).json({ message: "get products successfully", data: array });
  } catch (error) {
    throw new Error(error.message);
  }
};

const getProductsByCtegoryId = async (req, res) => {
  const lang = req.headers["accept-language"];
  const page = req.query.page || 1;
  const pageSize = req.query.pageSize || 10;

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

    const array = rows.map((row) => ({
      id: row.id,
      title: lang === "ru" ? row.title_ru : row.title_uz,
      price: row.price,
      money_type: row.money_type,
      img: row.img,
      gallery: row.gallery,
      characteristic: row.characteristic,
      discription: lang === "ru" ? row.description_ru : row.description_uz,
      created_at: dateHelper(row.created_at),
      updated_at: dateHelper(row.updated_at),
      unixTime: {
        created_at: row.created,
        updated_at: row.updated,
      },
    }));

    res.status(200).json({
      message: "Get products successfully",
      totalItems: count,
      totalPages: totalPages,
      currentPage: page,
      data: array,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const create = async (req, res) => {
  const start = Date.now();
  try {
    const {
      title_uz,
      title_ru,
      code,
      price,
      money_type,
      category_id,
      characteristic,
      description_uz,
      description_ru,
    } = req.body;
    const files = req.files;

    const img = files.img ? files.img[0] : null;
    const gallery = files.gallery
      ? files.gallery.map((file) => "/" + file.filename)
      : [];

    const newProduct = {
      title_uz,
      title_ru,
      code,
      price,
      money_type,
      description_uz,
      description_ru,
      category_id,
      characteristic: characteristic,
      img: img ? "/" + img.filename : null,
      gallery,
    };

    const product = await Product.create(newProduct);

    const end = Date.now();
    // console.log(`Product creation took ${end - start}ms`);

    res.status(201).json({
      creating: end - start + "ms",
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error(error.message);
  }
};

const update = async (req, res) => {
  try {
    const newProduct = {
      ...req.body,
    };

    const files = req.files;
    const currentProduct = await Product.findByPk(req.params.id);

    if (files && currentProduct) {
      if (currentProduct) {
        const img = files.img ? files.img[0] : null;
        if (img && currentProduct.img) {
          newProduct.img = "/" + img.filename;
          if (currentProduct && currentProduct.img) {
            unlinkFile([currentProduct.img]);
          }
        }

        const gallery = files.gallery
          ? files.gallery.map((file) => "/" + file.filename)
          : [];

        if (gallery.length > 0 && currentProduct.gallery) {
          unlinkFile(currentProduct.gallery);
          newProduct.gallery = gallery;
        }
      }
    }

    const product = await Product.update(newProduct, {
      where: { id: req.params.id },
    });

    if (product[0] === 0) {
      return res
        .status(404)
        .json({ message: "Product not fount", data: product });
    }

    res.status(200).json({ message: "Updated successfully", data: product });
  } catch (error) {
    throw new Error(error.message);
  }
};

const destroy = async (req, res) => {
  try {
    const currentProduct = await Product.findByPk(req.params.id);

    if (currentProduct) {
      if (currentProduct.img) {
        unlinkFile([currentProduct.img]);
      }

      if (currentProduct.gallery.length > 0 && currentProduct.gallery) {
        unlinkFile(currentProduct.gallery);
      }
    }

    await Product.destroy({
      where: { id: req.params.id },
    });

    res.status(200).json({ message: "Deleted successfully", data: true });
  } catch (error) {
    throw new Error(error.message);
  }
};

const isCyrillic = (text) => {
  return /[а-яА-ЯЁё]/.test(text);
};

const searchProducts = async (req, res) => {
  try {
    const searchText = req.query.text || "";

    if (!searchText) {
      return res.status(400).json({ message: "Search text is required" });
    }

    const searchField = isCyrillic(searchText) ? "title_ru" : "title_uz";

    const query = `SELECT p.*, c.title_uz as category_title_uz, c.title_ru as category_title_ru FROM products p JOIN categories c ON p.category_id = c.id WHERE p.${searchField} ILIKE :searchText`;

    const products = await SQL.query(query, {
      replacements: { searchText: `%${searchText}%` },
      type: SQL.QueryTypes.SELECT,
    });

    const array = products.map((product) => {
      return {
        id: product.id,
        title: searchField === "title_ru" ? product.title_ru : product.title_uz,
        price: product.price,
        img: product.img,
        gallery: product.gallery,
        characteristic: product.characteristic,
        categoryId: product.category_id,
        category_name:
          searchField === "title_ru" ? product.title_ru : product.title_uz,
        discription:
          searchField === "title_ru"
            ? product.description_ru
            : product.description_uz,
        created_at: product.created,
        updated_at: product.updated,
      };
    });
    res.status(200).json({ message: "Get product successfully", data: array });
  } catch (error) {
    console.error("Error searching products:", error);
    throw new Error(error.message);
  }
};

const filter = async (req, res) => {
  try {
    // req.query ichidagi query parametrlari
    const querys = { ...req.query };

    // SQL queryni qurish uchun boshlang'ich qism
    let sqlQuery = "SELECT * FROM products WHERE 1=1";
    let replacements = [];

    // query parametrlari orqali filterlarni qo'shish
    for (const key in querys) {
      if (querys.hasOwnProperty(key)) {
        if (key === "title_uz" || key === "title_ru") {
          sqlQuery += ` AND ${key} LIKE ?`;
          replacements.push(`%${querys[key]}%`);
        } else if (key === "from_to") {
          let fromTo = querys[key].split("-");
          if (fromTo.length === 2) {
            sqlQuery += ` AND "created_at" >= ? AND "created_at" <= ?`;
            replacements.push(fromTo[0], fromTo[1]);
          }
        } else {
          sqlQuery += ` AND ${key} = ?`;
          replacements.push(querys[key]);
        }
      }
    }

    // Sequelize orqali raw queryni bajarish
    const results = await SQL.query(sqlQuery, {
      replacements: replacements,
      type: Sequelize.QueryTypes.SELECT,
    });

    res.json(results);
  } catch (error) {
    console.error(error);
    throw Errors.internal(error.message);
  }
};

export default {
  getAll,
  getById,
  getProductsInOrder,
  getProductsByCtegoryId,
  create,
  update,
  searchProducts,
  filter,
  destroy,
};
