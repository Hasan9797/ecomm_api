// Models
import { Sequelize, Op } from "sequelize";
import dataBase from "../models/model.index.js";
import order_enum from "../enums/order_enum.js";
import { dateHelper } from "../helpers/dateHelper.js";
const { Order, SQL } = dataBase;

function isValidPhoneNumber(value) {
  const regex = /^[\d+]+$/;
  return regex.test(value) && value.replace(/\D/g, "").length >= 7;
}

const getAll = async (limit, offset, page, status) => {
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
        	WHERE status = ${status}
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
  } catch (err) {
    throw new Error(err.message);
  }
};

const getAllByCreated = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;

  const limit = pageSize; // Har bir sahifadagi order soni
  const offset = (page - 1) * pageSize; // Qaysi orderdan boshlab olish

  const result = await getAll(limit, offset, page, order_enum.STATUS_CREATE);

  res.status(200).json(result);
};

const getAllByWaiting = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;

  const limit = pageSize; // Har bir sahifadagi order soni
  const offset = (page - 1) * pageSize; // Qaysi orderdan boshlab olish

  const result = await getAll(limit, offset, page, order_enum.STATUS_WAITING);

  res.status(200).json(result);
};

const getAllBySuccess = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;

  const limit = pageSize; // Har bir sahifadagi order soni
  const offset = (page - 1) * pageSize; // Qaysi orderdan boshlab olish

  const result = await getAll(limit, offset, page, order_enum.STATUS_SUCCESS);

  res.status(200).json(result);
};

const getAllByInactive = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;

  const limit = pageSize; // Har bir sahifadagi order soni
  const offset = (page - 1) * pageSize; // Qaysi orderdan boshlab olish

  const result = await getAll(limit, offset, page, order_enum.STATUS_INACTIVE);

  res.status(200).json(result);
};

const getById = async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  res.status(200).json(order);
};

const create = async (req, res) => {
  const order = await Order.create({
    products: req.body.products,
    ...req.body,
  });
  res.status(201).json(order);
};

const update = async (req, res) => {
  if (req.body.user_number && !isValidPhoneNumber(req.body.user_number)) {
    return res.status(404).json({ message: "Invaled user number" });
  }
  const order = await Order.update(req.body, {
    where: { id: req.params.id },
  });
  res.status(200).json(order);
};

const destroy = async (req, res) => {
  const order = await Order.destroy({
    where: { id: req.params.id },
  });
  res.status(200).json(order);
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
        }

        sqlQuery += ` AND ${key} = ?`;
        replacements.push(querys[key]);
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

const getOrdersByProductCode = async (req, res) => {};

export default {
  getAllByCreated,
  getAllByWaiting,
  getAllBySuccess,
  getAllByInactive,
  getById,
  create,
  update,
  destroy,
  filter,
  getOrdersByProductCode,
};
