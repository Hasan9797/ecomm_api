import { Sequelize, Op } from "sequelize";
import dataBase from "../models/model.index.js";
const { Category, SQL } = dataBase;

class CategoryRepository {
  async createCategory(newCategory) {
    try {
      return await Category.create(newCategory);
    } catch (error) {
      throw new Error(error);
    }
  }

  async findAllCategorys(filters) {
    try {
      const whereClause = {};
      // Query parametrlari orqali filterlarni qo'shish
      for (const key in filters) {
        if (filters.hasOwnProperty(key)) {
          if (key === "title_uz" || key === "title_ru") {
            whereClause[key] = { [Sequelize.Op.like]: `%${filters[key]}%` };
          } else if (key === "from_to") {
            let fromTo = filters[key].split("-");
            if (fromTo.length === 2) {
              whereClause.createdAt = {
                [Sequelize.Op.between]: [
                  new Date(fromTo[0]),
                  new Date(fromTo[1]),
                ],
              };
            }
          } else {
            whereClause[key] = filters[key];
          }
        }
      }

      return await Category.findAll({
        where: whereClause,
        include: [
          {
            model: Category,
            as: "subcategories",
            attributes: [
              "id",
              "title_uz",
              "title_ru",
              "img",
              "created_at",
              "updated_at",
            ],
          },
        ],
        attributes: [
          "id",
          "title_uz",
          "title_ru",
          "img",
          "created_at",
          "updated_at",
        ],
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findCategoryById(categoryId) {
    try {
      const category = await Category.findByPk(categoryId, {
        include: [
          {
            model: Category,
            as: "subcategories",
            attributes: [
              "id",
              "title_uz",
              "title_ru",
              "img",
              "created_at",
              "updated_at",
            ],
          },
        ],
        attributes: [
          "id",
          "title_uz",
          "title_ru",
          "img",
          "created_at",
          "updated_at",
        ],
      });
      return category ? category.toJSON() : null;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateCategory(categoryId, updateData) {
    return await Category.update(updateData, {
      where: { id: categoryId },
    });
  }

  async deleteCategory(categoryId) {
    return await Category.destroy({
      where: { id: categoryId },
    });
  }
}

export default new CategoryRepository();
