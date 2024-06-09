import { Sequelize, Op } from "sequelize";
import dataBase from "../models/model.index.js";
const { Order, SQL } = dataBase;

class OrderRepository {
  async createOrder(order) {
    return await Order.create(order);
  }

  async findAllOrders(limit, offset) {
    try {
      // Umumiy orderlar sonini olish
      const countResult = await SQL.query(
        "SELECT COUNT(*) as count FROM orders",
        {
          type: Sequelize.QueryTypes.SELECT,
        }
      );
      if (countResult[0].count > 0) {
        const count = countResult[0].count;

        // Sahifalangan orderlarni olish
        const rows = await SQL.query(
          `SELECT * FROM orders
      			ORDER BY 
     			  CASE 
        		  WHEN status = 1 THEN 1
       		  	WHEN status = 2 THEN 2
        		  WHEN status = 3 THEN 3
      			ELSE 4
     			  END
     			LIMIT ${limit} OFFSET ${offset};`,
          {
            type: Sequelize.QueryTypes.SELECT,
          }
        );
        const totalPages = Math.ceil(count / limit);

        return {
          totalItems: +count,
          totalPages: totalPages,
          currentPage: page,
          orders: rows,
        };
      }
      return {
        totalItems: 0,
        totalPages: 0,
        currentPage: 0,
        orders: [],
      };
    } catch (err) {
      return {
        error: true,
        errorMessage: err.message,
      };
    }
  }

  async findOrderById(orderId) {
    return await Order.findByPk(orderId);
  }

  async updateOrder(orderId, updateData) {
    return await Order.update(updateData, {
      where: { id: orderId },
    });
  }

  async deleteOrder(orderId) {
    return await Order.destroy({
      where: { id: orderId },
    });
  }
}

export default new OrderRepository();
