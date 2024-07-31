import { Sequelize, Op } from "sequelize";
import dataBase from "../models/model.index.js";
const { Order } = dataBase;

const getAllReport = async (startDate, endDate) => {
  try {
    const result = await Order.findAll({
      attributes: [
        "status",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "total_orders"],
        [
          Sequelize.fn("JSON_AGG", Sequelize.literal('ROW_TO_JSON("Order")')),
          "orders",
        ],
      ],
      where: {
        created_at: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: ["status"],
    });

    return result;
  } catch (error) {
    console.error("Error fetching order stats:", error);
    throw error;
  }
};

const getReportByUser = async (startDate, endDate, userNumber) => {
  try {
    const result = await Order.findAll({
      attributes: [
        "status",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "total_orders"],
        [
          Sequelize.fn("JSON_AGG", Sequelize.literal('ROW_TO_JSON("order")')),
          "orders",
        ],
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        user_number: userNumber,
      },
      group: ["status"],
    });

    return result;
  } catch (error) {
    console.error("Error fetching order stats:", error);
    throw error;
  }
};

export default { getAllReport, getReportByUser };
