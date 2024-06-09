import { Sequelize, Op } from "sequelize";
import dataBase from "../models/model.index.js";
const { Product, SQL } = dataBase;

class ProductRepository {
  async createProduct(product) {
    return await Product.create(product);
  }

  async findAllProducts() {
    return await Product.findAll();
  }

  async findProductById(productId) {
    return await Product.findByPk(productId);
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
