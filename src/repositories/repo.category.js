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

  async findAllCategorys() {
    try {
      return await Category.findAll({
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
