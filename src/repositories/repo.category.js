import { Sequelize, Op } from "sequelize";
import dataBase from "../models/model.index.js";
const { Category, SQL } = dataBase;

class CategoryRepository {
  async createCategory(category) {
    return await Category.create(category);
  }

  async findAllCategorys() {
    return await Category.findAll();
  }

  async findCategoryById(categoryId) {
    return await Category.findByPk(categoryId);
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
