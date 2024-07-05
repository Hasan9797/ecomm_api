// Models
import { Sequelize, Op } from "sequelize";
import dataBase from "../models/model.index.js";
import orderService from "../services/service.order.js";
const { Order, SQL } = dataBase;

function isValidPhoneNumber(value) {
  const regex = /^[\d+]+$/;
  return regex.test(value) && value.replace(/\D/g, "").length >= 7;
}

// Orders
const getAll = async (req, res) => {
  const { limit, offset, page, pageSize, ...filters } = req.query;
  const oerderPage = parseInt(page) || 1;
  const orderPageSize = parseInt(pageSize) || 20;

  const orderLimit = orderPageSize; // Har bir sahifadagi order soni
  const orderOffset = (oerderPage - 1) * orderPageSize; // Qaysi orderdan boshlab olish

  try {
    const orders = await orderService.getAllOrders(
      orderLimit,
      orderOffset,
      oerderPage,
      filters
    );
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
  }
};

const getById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found", data: false });
    }
    res.status(200).json({ message: "Get Order Successfully", data: order });
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

const create = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);

    res.status(201).json({ message: "Created Successfully", data: order });
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

const update = async (req, res) => {
  try {
    if (req.body.user_number && !isValidPhoneNumber(req.body.user_number)) {
      return res.status(404).json({ message: "Invaled user number" });
    }
    const order = await Order.update(req.body, {
      where: { id: req.params.id },
    });
    if (order > 0) {
      res.status(200).json({ message: "Updated Successfully", data: true });
    }
    res.status(200).json({ message: "Updated Error", data: false });
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

const destroy = async (req, res) => {
  try {
    await Order.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "Deleted Successfully", data: true });
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

const filter = async (req, res) => {
  try {
    // req.query ichidagi query parametrlari
    const querys = { ...req.query };

    // SQL queryni qurish uchun boshlang'ich qism
    let sqlQuery = "SELECT * FROM orders WHERE 1=1";
    let replacements = [];

    // query parametrlari orqali filterlarni qo'shish
    for (const key in querys) {
      if (querys.hasOwnProperty(key)) {
        if (key === "user_name" || key === "user_number") {
          sqlQuery += ` AND ${key} LIKE ?`;
          replacements.push(`%${querys[key]}%`);
        } else if (key === "from_to") {
          let fromTo = querys[key].split("-");
          if (fromTo.length === 2) {
            sqlQuery += ` AND "created_at" >= ? AND "created_at" <= ?`;
            replacements.push(fromTo[0], fromTo[1]);
          }
        } else {
          sqlQuery += ` AND ${key} = ?`;
          replacements.push(querys[key]);
        }
      }
    }

    // Sequelize orqali raw queryni bajarish
    const results = await SQL.query(sqlQuery, {
      replacements: replacements,
      type: Sequelize.QueryTypes.SELECT,
    });

    res.json(results);
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

const getOrdersByProductCode = async (req, res) => {
  try {
    const date = req.query.date;
    const code = req.query.code;

    let sqlQuery = "";

    if (!date) {
      sqlQuery = `SELECT * FROM orders`;
    } else {
      sqlQuery = `SELECT * FROM orders WHERE created_at = ${date}`;
    }

    const orders = await SQL.query(sqlQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });
    console.log(orders);
    const array = [];
    orders.forEach((order) => {
      order.products.forEach((product) => {
        if (product.code === code) {
          array.push(order);
        }
      });
    });

    res.status(200).json({ message: "Get Order Successfully", data: array });
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  destroy,
  filter,
  getOrdersByProductCode,
};
