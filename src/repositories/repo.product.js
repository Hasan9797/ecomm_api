import { Sequelize, Op } from "sequelize";
import dataBase from "../models/model.index.js";
import GlobalError from "../errors/generalError.js";
import { dateHelper } from "../helpers/dateHelper.js";
const { Product, SQL, Category } = dataBase;

class ProductRepository {
  async createProduct(product) {
    return await Product.create(product);
  }

  async findAllProducts(limit, offset, filters) {
    try {
      if (filters === false) {
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

        // Sahifalangan yozuvlarni olish (oxiridan)
        const rows = await SQL.query(
          `SELECT p.*, c.title_uz as category_title_uz, c.title_ru as category_title_ru
          FROM products p
          LEFT JOIN categories c ON p.category_id = c.id
          ORDER BY p.id DESC
          LIMIT :limit OFFSET :offset`,
          {
            replacements: { limit: limit, offset: offset },
            type: SQL.QueryTypes.SELECT,
            raw: true,
          }
        );

        const totalPages = Math.ceil(count / limit);
        return { rows, totalPages, count };
      }

      let sqlQuery = `SELECT p.*, c.title_uz as category_title_uz, c.title_ru as category_title_ru
                  FROM products p
                  LEFT JOIN categories c ON p.category_id = c.id
                  WHERE 1=1`;
      let countQuery = `SELECT COUNT(*) as count
                    FROM products p
                    LEFT JOIN categories c ON p.category_id = c.id
                    WHERE 1=1`;
      let replacements = [];

      // Query parametrlari orqali filterlarni qo'shish
      for (const key in filters) {
        if (filters.hasOwnProperty(key)) {
          if (key === "title") {
            sqlQuery += ` AND (p.title_uz LIKE ? OR p.title_ru LIKE ?)`;
            countQuery += ` AND (p.title_uz LIKE ? OR p.title_ru LIKE ?)`;
            replacements.push(`%${filters[key]}%`, `%${filters[key]}%`);
          } else if (key === "from_to") {
            let fromTo = filters[key].split("-");
            if (fromTo.length === 2) {
              sqlQuery += ` AND p.created_at >= ? AND p.created_at <= ?`;
              countQuery += ` AND p.created_at >= ? AND p.created_at <= ?`;
              replacements.push(parseInt(fromTo[0]), parseInt(fromTo[1]));
            }
          } else {
            sqlQuery += ` AND p.${key} = ?`;
            countQuery += ` AND p.${key} = ?`;
            replacements.push(filters[key]);
          }
        }
      }

      // COUNT queryni bajarish
      const [countResult] = await SQL.query(countQuery, {
        replacements: replacements,
        type: Sequelize.QueryTypes.SELECT,
      });

      if (!countResult || countResult.count == 0) {
        return {
          totalItems: 0,
          totalPages: 0,
          currentPage: 0,
          rows: [],
        };
      }
      const count = countResult.count;

      // Sahifalangan yozuvlarni olish (oxiridan)
      sqlQuery += ` ORDER BY p.id DESC LIMIT ? OFFSET ?`;
      replacements.push(limit, offset);

      const rows = await SQL.query(sqlQuery, {
        replacements: replacements,
        type: SQL.QueryTypes.SELECT,
        raw: true,
      });

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
        return { status: 404, message: "Products not found", data: {} };
      }

      const {
        id,
        title_uz,
        title_ru,
        code,
        img,
        gallery,
        price,
        money_type,
        status,
        characteristic,
        description_uz,
        description_ru,
        category_id,
        updated_at,
        created_at,
        category,
      } = product.toJSON();

      return {
        status: 200,
        message: "Get product successfully",
        data: {
          id,
          title_uz,
          title_ru,
          code,
          img,
          gallery,
          price,
          money_type,
          status,
          characteristic,
          description_uz,
          description_ru,
          category_id,
          category,
          created_at: dateHelper(created_at),
          updated_at: dateHelper(updated_at),
          unixTime: {
            created_at: Number(created_at),
            updated_at: Number(updated_at),
          },
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
