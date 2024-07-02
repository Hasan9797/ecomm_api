import { Sequelize, Op } from "sequelize";
import dataBase from "../models/model.index.js";
import GlobalError from "../errors/generalError.js";
import { dateHelper } from "../helpers/dateHelper.js";
const { Product, SQL, Category } = dataBase;

class ProductRepository {
  async createProduct(product) {
    return await Product.create(product);
  }

  async findAllProducts(limit, offset, between) {
    try {
      if (between === false) {
        const [countResult] = await SQL.query(
          "SELECT COUNT(*) as count FROM products",
          {
            type: Sequelize.QueryTypes.SELECT,
          }
        );

        if (!countResult || countResult.count == 0) {
          throw GlobalError.notFound("Products not found");
        }
        const count = countResult.count;

        // Sahifalangan yozuvlarni olish
        const rows = await SQL.query(
          `SELECT p.*, c.title_uz as category_title_uz, c.title_ru as category_title_ru
            FROM products p
             LEFT JOIN categories c ON p.category_id = c.id
             LIMIT :limit OFFSET :offset`,
          {
            replacements: { limit: limit, offset: offset },
            type: SQL.QueryTypes.SELECT,
            raw: true,
          }
        );
        // console.log(rows);
        const totalPages = Math.ceil(count / limit);
        return { rows, totalPages, count };
      }

      // Created_at between
      const from_to_date = between.split("-");
      const [countResult] = await SQL.query(
        `SELECT COUNT(*) as count FROM products WHERE createdAt >= ${from_to_date[0]} AND createdAt <= ${from_to_date[1]}`,
        {
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (!countResult || countResult.count == 0) {
        throw GlobalError.notFound("Products not found");
      }
      const count = countResult.count;

      // Sahifalangan yozuvlarni olish
      const rows = await SQL.query(
        `SELECT p.*, c.title_uz as category_title_uz, c.title_ru as category_title_ru
            FROM products p
             LEFT JOIN categories c ON p.category_id = c.id
             WHERE createdAt >= ${from_to_date[0]} AND createdAt <= ${from_to_date[1]}
             LIMIT :limit OFFSET :offset`,
        {
          replacements: { limit: limit, offset: offset },
          type: SQL.QueryTypes.SELECT,
          raw: true,
        }
      );
      // console.log(rows);
      const totalPages = Math.ceil(count / limit);
      return { rows, totalPages, count };
    } catch (error) {
      throw GlobalError.internal(error.message);
    }
  }

  async findProductById(productId) {
    try {
      const product = await Product.findByPk(productId, {
        include: [
          {
            model: Category,
            as: "category",
          },
        ],
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found", data: {} });
      }

      // Aylanishni oldini olish uchun toJSON() metodidan foydalanamiz
      const plainProduct = product.toJSON();

      return {
        message: "Get product successfully",
        data: {
          createdAt: dateHelper(plainProduct.createdAt),
          updatedAt: dateHelper(plainProduct.updatedAt),
          unixTime: {
            created_at: plainProduct.createdAt,
            updated_at: plainProduct.updatedAt,
          },
          ...plainProduct,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateProduct(productId, updateData) {
    return await Product.update(updateData, {
      where: { id: productId },
    });
  }

  async deleteProduct(productId) {
    return await Product.destroy({
      where: { id: productId },
    });
  }
}

export default new ProductRepository();
