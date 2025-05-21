import ProductRepository from "../repositories/repo.product.js";
import GlobalError from "../errors/generalError.js";
import { dateHelper } from "../helpers/dateHelper.js";

const getAllProducts = async (lang, page, pageSize, filters) => {
  try {
    const limit = pageSize; // Har bir sahifadagi yozuvlar soni
    const offset = (page - 1) * pageSize; // Qaysi yozuvdan boshlab olish

    const { rows, totalPages, count } = await ProductRepository.findAllProducts(
      limit,
      offset,
      filters
    );

    const array = rows.map((row) => {
      return {
        ...row,
        id: row.id,
        title: lang === "ru" ? row.title_ru : row.title_uz,
        category_name:
          lang === "ru" ? row.category_title_ru : row.category_title_uz,
        discription: lang === "ru" ? row.description_ru : row.description_uz,
        // created_at: dateHelper(row.created_at),
        // updated_at: dateHelper(row.created_at),
        // unixdate: {
        //   created_at: row.created_at,
        //   updated_at: row.created_at,
        // },
      };
    });

    return {
      message: "Get products successfully",
      totalItems: count,
      totalPages: totalPages,
      currentPage: page,
      data: array,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw GlobalError.internal(error.message);
  }
};

const getProductById = async (productId) => {
  try {
    return await ProductRepository.findProductById(productId);
  } catch (error) {
    console.error("Error fetching product:", error);
    throw GlobalError.internal(error.message);
  }
};

const getCodesByProducts = async () => {
  try {
    return await ProductRepository.getCodeByProducts();
  } catch (error) {
    console.error("Error updating product:", error);
    throw GlobalError.internal(error.message);
  }
};

export default { getAllProducts, getProductById, getCodesByProducts };
