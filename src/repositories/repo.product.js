import { Sequelize, Op } from "sequelize";
import dataBase from "../models/model.index.js";
import GlobalError from "../errors/generalError.js";
import { buildQuery } from "../helpers/filterWhereHelper.js";
import { dateHelper } from "../helpers/dateHelper.js";

const { Product, SQL, Category } = dataBase;

class ProductRepository {
  async createProduct(product) {
    return await Product.create(product);
  }

  async findAllProducts(limit, offset, filters) {
    try {
      if (filters === false) {
        const [countResult] = await SQL.query('SELECT COUNT(*) as count FROM products', {
          type: Sequelize.QueryTypes.SELECT,
        });

        const count = countResult?.count || 0;
        if (count === 0) {
          throw GlobalError.notFound('Products not found');
        }

        const rows = await SQL.query(
          `SELECT p.*, c.title_uz as category_title_uz, c.title_ru as category_title_ru
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         ORDER BY p.id DESC
         LIMIT :limit OFFSET :offset`,
          {
            replacements: { limit, offset },
            type: Sequelize.QueryTypes.SELECT,
            raw: true,
          }
        );

        return {
          totalItems: count,
          totalPages: Math.ceil(count / limit),
          currentPage: Math.floor(offset / limit) + 1,
          rows,
        };
      }

      // Filterlar bilan query
      const baseQuery = `SELECT p.*, c.title_uz as category_title_uz, c.title_ru as category_title_ru
                      FROM products p
                      LEFT JOIN categories c ON p.category_id = c.id`;
      const baseCountQuery = `SELECT COUNT(*) as count
                          FROM products p
                          LEFT JOIN categories c ON p.category_id = c.id`;
      const result = await buildQuery(SQL, baseQuery, baseCountQuery, filters, limit, offset, 'p.');

      return {
        rows: result.rows,
        totalPages: result.totalPages,
        count: result.totalItems,
      };
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

  async getCodeByProducts() {
    try {
      // SQL queryni qurish uchun boshlang'ich qism
      let sqlQuery = "SELECT code FROM products";

      // Sequelize orqali raw queryni bajarish
      const results = await SQL.query(sqlQuery, {
        type: Sequelize.QueryTypes.SELECT,
      });

      return results;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

export default new ProductRepository();
