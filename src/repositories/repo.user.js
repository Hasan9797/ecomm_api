import { Sequelize, Op } from "sequelize";
import dataBase from "../models/model.index.js";
const { User, SQL } = dataBase;

class UserRepository {
  async createUser(user) {
    return await User.create(user);
  }

  async findAllUsers(page, pageSize, filters = {}) {
    try {
      const offset = (page - 1) * pageSize;
      const limit = pageSize;

      const whereClause = {};

      // Faqat filtrlar bo‘sh bo‘lsa, barcha foydalanuvchilarni sahifalab olish
      if (Object.keys(filters).length === 0) {
        return await User.findAll({ limit, offset, raw: true });
      }

      // Query parametrlari orqali filterlarni qo‘shish
      for (const key in filters) {
        if (filters.hasOwnProperty(key)) {
          if (key === "title") {
            whereClause[Sequelize.Op.or] = [
              { title_uz: { [Sequelize.Op.like]: `%${filters[key]}%` } },
              { title_ru: { [Sequelize.Op.like]: `%${filters[key]}%` } },
            ];
          } else if (key === "from_to") {
            let fromTo = filters[key].split("-");
            const fromDate = parseInt(fromTo[0]);
            const toDate = parseInt(fromTo[1]);

            if (!isNaN(fromDate) && !isNaN(toDate)) {
              whereClause.created_at = {
                [Sequelize.Op.between]: [fromDate, toDate],
              };
            }
          } else {
            whereClause[key] = filters[key];
          }
        }
      }

      return await User.findAll({
        where: whereClause,
        raw: true,
        limit,
        offset,
      });
    } catch (error) {
      throw error;
    }
  }


  async getUserById(userId) {
    try {
      return await User.findByPk(userId);
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId, updateData) {
    try {
      return await User.update(updateData, {
        where: { id: userId },
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      return await User.destroy({
        where: { id: userId },
      });
    } catch (error) {
      throw error;
    }
  }

  async getUserByAccessToken(accessToken) {
    try {
      return await User.findOne({
        where: { access_token: accessToken },
      });
    } catch (error) {
      throw error;
    }
  }
}

export default new UserRepository();
