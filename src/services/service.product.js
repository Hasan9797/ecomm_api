import ProductRepository from "../repositories/repo.product.js";
import GlobalError from "../errors/generalError.js";
import { dateHelper } from "../helpers/dateHelper.js";

const getAllProducts = async (lang, page, pageSize) => {
  try {
    const limit = pageSize; // Har bir sahifadagi yozuvlar soni
    const offset = (page - 1) * pageSize; // Qaysi yozuvdan boshlab olish

    const { rows, totalPages, count } = await ProductRepository.findAllProducts(
      limit,
      offset
    );

    const array = rows
      .sort((a, b) => b.id - a.id)
      .map((row) => {
        return {
          id: row.id,
          title: lang === "ru" ? row.title_ru : row.title_uz,
          price: row.price,
          img: row.img,
          gallery: row.gallery,
          characteristic: row.characteristic || null,
          categoryId: row.category_id || null,
          category_name:
            lang === "ru" ? row.category_title_ru : row.category_title_uz,
          discription: lang === "ru" ? row.description_ru : row.description_uz,
          code: row.code,
          createdAt: dateHelper(row.createdAt),
          updatedAt: dateHelper(row.updatedAt),
          unixdate: {
            created_at: row.createdAt,
            updated_at: row.updatedAt,
          },
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

export default { getAllProducts, getProductById };
