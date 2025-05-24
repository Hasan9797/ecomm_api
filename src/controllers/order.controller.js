// Models
import { Sequelize, Op } from "sequelize";
import dataBase from "../models/model.index.js";
import orderService from "../services/order.service.js";
const { Order, SQL } = dataBase;

function isValidPhoneNumber(value) {
  const regex = /^[\d+]+$/;
  return regex.test(value) && value.replace(/\D/g, "").length >= 7;
}

// Orders
const getAll = async (req, res, next) => {
  const { page, pageSize, ...filters } = req.query;
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
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found", data: false });
    }
    res.status(200).json({ message: "Get Order Successfully", data: order });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.body);

    res.status(201).json({ message: "Created Successfully", data: order });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const update = async (req, res, next) => {
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
    next(error);
  }
};

const destroy = async (req, res, next) => {
  try {
    await Order.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "Deleted Successfully", data: true });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getOrderByUserName = async (req, res, next) => {
  try {
    const { page, pageSize, ...querys } = req.query;
    const oerderPage = page || 1;
    const orderPageSize = pageSize || 20;

    const limit = orderPageSize; // Har bir sahifadagi order soni
    const offset = (oerderPage - 1) * orderPageSize; // Qaysi orderdan boshlab olish

    const results = await orderService.getOrdersByUser(
      querys,
      limit,
      offset,
      page
    );
    res.json(results);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getOrdersByProductCode = async (req, res, next) => {
  try {
    const date = req.query.date || "";
    const code = req.query.code;

    const array = await orderService.getOrdersByProductCode(code, date);

    res.status(200).json({ message: "Get Order Successfully", data: array });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getUsersInfoByOrder = async (req, res, next) => {
  const { page, pageSize, ...filters } = req.query;
  const oerderPage = parseInt(page) || 1;
  const orderPageSize = parseInt(pageSize) || 20;
  const orderFilters = filters || {};
  try {
    const result = await orderService.getUsersInfoBySuccessOrder(
      parseInt(oerderPage),
      parseInt(orderPageSize),
      orderFilters
    );
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const generateOrderExcel = async (req, res, next) => {
  try {
    const date = req.query.date || "today";
    const status = req.query.status ? Number(req.query.status) : null;

    const buffer = await orderService.exportOrdersToExcel(date, status);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=orders.xlsx');
    res.send(buffer);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  destroy,
  getUsersInfoByOrder,
  getOrdersByProductCode,
  getOrderByUserName,
  generateOrderExcel,
};
