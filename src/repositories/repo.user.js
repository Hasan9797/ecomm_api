import { Sequelize, Op } from "sequelize";
import dataBase from "../models/model.index.js";
const { User, SQL } = dataBase;

class UserRepository {
  async createUser(user) {
    return await User.create(user);
  }

  async findAllUsers() {
    return await User.findAll();
  }

  async findUserById(userId) {
    return await User.findByPk(userId);
  }

  async updateUser(userId, updateData) {
    return await User.update(updateData, {
      where: { id: userId },
    });
  }

  async deleteUser(userId) {
    return await User.destroy({
      where: { id: userId },
    });
  }
}

export default new UserRepository();
