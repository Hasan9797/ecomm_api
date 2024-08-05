import OrderRepository from "../repositories/repo.order.js";
import GlobalError from "../errors/generalError.js";
import { dateHelper } from "../helpers/dateHelper.js";
import order from "../routers/router.order.js";

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

const getUsersInfoBySuccessOrder = async (page, pageSize, filters) => {
  const orders = await OrderRepository.getUserInfoBySuccessOrder(
    page,
    pageSize,
    filters
  );

  // const sortedData = orders.sort(
  //   (a, b) => a.products.length - b.products.length
  // );

  let array = [];

  orders.rows?.forEach((order) => {
    array.push({
      order_id: order.id,
      name: order.user_name,
      number: order.user_number,
      product_count: order.products.length,
    });
  });

  return { ...orders, rows: array };
};

export default {
  getAllOrders,
  getOrderById,
  createOrder,
  getOrdersByUser,
  getOrdersByProductCode,
  getUsersInfoBySuccessOrder,
};
