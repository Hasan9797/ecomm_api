// Models
import dataBase from "../models/model.index.js";
const { Order, Query } = dataBase;

// Controllers
export const getAll = async (req, res) => {
  const page = req.query.page;
  const pageSize = req.query.pageSize;

  const limit = pageSize; // Har bir sahifadagi order soni
  const offset = (page - 1) * pageSize; // Qaysi orderdan boshlab olish

  try {
    // Umumiy orderlar sonini olish
    const [countResult] = await Query.query(
      "SELECT COUNT(*) as count FROM products"
    );

    if (!countResult) {
    }
    const count = countResult[0].count;

    // Sahifalangan orderlarni olish
    const [rows] = await Query.query(
      `SELECT * FROM orders LIMIT :limit OFFSET :offset`,
      {
        replacements: { limit: limit, offset: offset },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      totalItems: count,
      totalPages: totalPages,
      currentPage: page,
      orders: rows,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      errorMessage: error,
    });
  }
};

export const getById = async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  res.status(200).json(order);
};

export const create = async (req, res) => {
  const order = await Order.create(req.body);
  res.status(201).json(order);
};

export const update = async (req, res) => {
  const order = await Order.update(req.body, {
    where: { id: req.params.id },
  });
  res.status(200).json(order);
};

export const destroy = async (req, res) => {
  const order = await Order.destroy({
    where: { id: req.params.id },
  });
  res.status(200).json(order);
};
