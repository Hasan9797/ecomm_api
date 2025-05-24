import OrderRepository from "../repositories/repo.order.js";
import GlobalError from "../errors/generalError.js";
import { dateHelper, dateHelperForExcel } from "../helpers/dateHelper.js";
import ExcelJS from "exceljs";
import { now } from "sequelize/lib/utils";

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

const exportOrdersToExcel = async (date, status) => {
  const { from, to } = dateHelperForExcel(date);

  try {
    const orders = await OrderRepository.getOrdersForExcel(from, to, status);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Заказы_${Date.now()}`);

    // Sarlavha
    worksheet.columns = [
      { header: 'Order ID', key: 'order_id', width: 10 },
      { header: 'User Name', key: 'user_name', width: 20 },
      { header: 'User Number', key: 'user_number', width: 15 },
      { header: 'Order Created At', key: 'order_created_at', width: 20 },
      { header: 'Product ID', key: 'product_id', width: 10 },
      { header: 'Product Title (UZ)', key: 'product_title_uz', width: 25 },
      { header: 'Category', key: 'category', width: 25 },
      { header: 'Price', key: 'price', width: 10 },
      { header: 'Selected Size', key: 'selected_size', width: 15 },
      { header: 'Count', key: 'count', width: 10 },
      { header: 'Characteristic', key: 'characteristics', width: 15 },
    ];

    // Ma'lumotlarni kiritish
    for (const order of orders) {
      for (const product of order.products) {
        const characteristics = Array.isArray(product.characteristic)
          ? product.characteristic.map(c => `${c.label}: ${c.value}`).join(', ')
          : '';

        worksheet.addRow({
          order_id: order.id,
          user_name: order.user_name,
          user_number: order.user_number,
          order_created_at: new Date(order.created_at * 1000).toISOString().slice(0, 19).replace('T', ' '),
          product_id: product.id,
          product_title_uz: product.title_uz,
          category: product.category ? product.category.title_uz : '',
          price: product.price,
          selected_size: product.selected_size,
          count: product.count,
          characteristics
        });
      }
    }

    // buffer qaytaramiz (response ichida uzatish uchun)
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  } catch (error) {
    console.error("Error exporting orders to Excel:", error);
    throw GlobalError.internal(error.message);
  }
};

export default {
  getAllOrders,
  getOrderById,
  createOrder,
  getOrdersByUser,
  getOrdersByProductCode,
  getUsersInfoBySuccessOrder,
  exportOrdersToExcel,
};
