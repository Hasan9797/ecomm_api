import Errors from "../../errors/generalError.js";
import categoryService from "../../services/category.service.js";

const getAll = async (req, res, next) => {
  const lang = req.headers["accept-language"] || "uz";
  const { page, pageSize } = req.query;
  try {
    const categories = await categoryService.getCategories(lang);
    if (categories.status === 404) {
      return res
        .status(404)
        .json({ message: categories.message, data: categories.data });
    }
    res.status(200).json(categories);
  } catch (err) {
    throw new Error(err);
  }
};

export default { getAll };
