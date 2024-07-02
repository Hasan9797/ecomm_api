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
  try {
    const order = await Order.findByPk(req.params.id);
    res.status(200).json({ message: "Get Order Successfully", data: order });
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

const create = async (req, res) => {
  try {
    const order = await Order.create({
      products: req.body.products,
      ...req.body,
    });
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
            sqlQuery += ` AND "createdAt" >= ? AND "createdAt" <= ?`;
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

    let sqlQuery = `SELECT * FROM orders WHERE created_at = ${date}`;

    const orders = await SQL.query(sqlQuery, {
      type: Sequelize.QueryTypes.SELECT,
    });

    const array = orders.map((order) => {
      order.products.forEach((product) => {
        if (product.code === req.query.code) {
          return order;
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
