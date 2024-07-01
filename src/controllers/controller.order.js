// Models
import { Sequelize, Op } from "sequelize";
import dataBase from "../models/model.index.js";
import order_enum from "../enums/order_enum.js";
const { Order, SQL } = dataBase;

function isValidPhoneNumber(value) {
  const regex = /^[\d+]+$/;
  return regex.test(value) && value.replace(/\D/g, "").length >= 7;
}

// Orders
const getAll = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 20;

  const limit = pageSize; // Har bir sahifadagi order soni
  const offset = (page - 1) * pageSize; // Qaysi orderdan boshlab olish

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
        		  WHEN status = ${order_enum.STATUS_CREATE} THEN 1
       		  	  WHEN status = ${order_enum.STATUS_WAITING} THEN 2
        		  WHEN status = ${order_enum.STATUS_SUCCESS} THEN 2
        		  WHEN status = ${order_enum.STATUS_INACTIVE} THEN 4
      			ELSE 5
     			END
     			LIMIT ${limit} OFFSET ${offset};`,
        {
          type: Sequelize.QueryTypes.SELECT,
        }
      );
      const totalPages = Math.ceil(count / limit);

      return res.status(200).json({
        totalItems: +count,
        totalPages: totalPages,
        currentPage: page,
        orders: rows,
      });
    }
  } catch (err) {
    return res.status(400).json({
      error: true,
      errorMessage: err.message,
    });
  }
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

export default { getAll, getById, create, update, destroy };
