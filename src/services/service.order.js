import OrderRepository from "../repositories/repo.order.js";
import GlobalError from "../errors/generalError.js";
import { dateHelper } from "../helpers/dateHelper.js";

const getAllOrders = async (limit, offset, page, filters) => {
  try {
    const orders = await OrderRepository.findAllOrders(
      limit,
      offset,
      page,
      filters
    );
    return orders;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw GlobalError.internal(error.message);
  }
};

const getOrderById = async (orderId) => {
  try {
    return await OrderRepository.findOrderById(orderId);
  } catch (error) {
    console.error("Error fetching product:", error);
    throw GlobalError.internal(error.message);
  }
};

const createOrder = async (body) => {
  try {
    const order = await OrderRepository.createOrder(body);
    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    throw GlobalError.internal(error.message);
  }
};

const updateOrder = async (orderId, updateData) => {};

const deleteOrder = async (orderId) => {};

const getOrdersByProductCode = async (productCode, date) => {
  try {
    const orders = await OrderRepository.getOrdersFromTo(date);
    const array = [];
    orders.forEach((order) => {
      order.products.forEach((product) => {
        if (product.code === productCode) {
          array.push(order);
        }
      });
    });
    return array;
  } catch (error) {
    console.error("Error creating order:", error);
    throw GlobalError.internal(error.message);
  }
};

const getOrdersByUser = async (querys, limit, offset, page) => {
  return await OrderRepository.getByUserName(querys, limit, offset, page);
};

export default {
  getAllOrders,
  getOrderById,
  createOrder,
  getOrdersByUser,
  getOrdersByProductCode,
};
