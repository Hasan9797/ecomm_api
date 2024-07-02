import ProductRepository from "../repositories/repo.product.js";
import GlobalError from "../errors/generalError.js";
import { dateHelper } from "../helpers/dateHelper.js";

const getAllOrders = async (lang, page, pageSize) => {
  const limit = pageSize; // Har bir sahifadagi yozuvlar soni
  const offset = (page - 1) * pageSize; // Qaysi yozuvdan boshlab olish

  try {
    const { rows, totalPages, count } = await ProductRepository.findAllProducts(
      limit,
      offset
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    throw GlobalError.internal(error.message);
  }
};

const getOrderById = async (orderId) => {
  try {
    return await ProductRepository.findProductById(orderId);
  } catch (error) {
    console.error("Error fetching product:", error);
    throw GlobalError.internal(error.message);
  }
};

const createOrder = async (orderData) => {};

const updateOrder = async (orderId, updateData) => {};

const deleteOrder = async (orderId) => {};

const getOrdersByProductCode = async (productCode, productCodeUpdate) => {};

export default { getAllOrders, getOrderById };
