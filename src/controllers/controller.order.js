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
  const status = parseInt(req.query.status) || 0;

  const limit = pageSize; // Har bir sahifadagi order soni
  const offset = (page - 1) * pageSize; // Qaysi orderdan boshlab olish

  try {
    if (status === 0) {
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
    }
    // Status orqali orderlar sonini olish
    const countResult = await SQL.query(
      `SELECT COUNT(*) as count FROM orders WHERE status = ${status}`,
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

      return res.status(200).json({
        totalItems: +count,
        totalPages: totalPages,
        currentPage: page,
        orders: rows,
      });
    }

    return res.status(200).json({
      totalItems: 0,
      totalPages: 0,
      currentPage: 0,
      orders: [],
    });
  } catch (err) {
    console.error(err);
    throw new Error(err.message);
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
        if (key === "user_name") {
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

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export default { getAll, getById, create, update, destroy, filter };
