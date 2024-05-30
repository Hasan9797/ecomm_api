import { Sequelize } from "sequelize";
import { db } from "./connections/connection.db.js";

export const getAll = async (req, res) => {
  const page = req.query.page;
  const pageSize = req.query.pageSize;

  const limit = pageSize; // Har bir sahifadagi yozuvlar soni
  const offset = (page - 1) * pageSize; // Qaysi yozuvdan boshlab olish

  // Umumiy yozuvlar sonini olish
  const [countResult] = await db.query("SELECT COUNT(*) as count FROM product");

  if (countResult) {
    const count = countResult[0].count;

    // Sahifalangan yozuvlarni olish
    const [rows] = await db.query(
      `SELECT * FROM product LIMIT :limit OFFSET :offset`,
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
      users: rows,
    });
  }
};
