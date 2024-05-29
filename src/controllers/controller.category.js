import { SequalizeORM } from './connections/connect.js';
const { sequelize } = SequalizeORM.sequelizeQuery();

export const getAll = async (req, res) => {
	const page = req.query.page;
	const pageSize = req.query.pageSize;

	const limit = pageSize; // Har bir sahifadagi yozuvlar soni
	const offset = (page - 1) * pageSize; // Qaysi yozuvdan boshlab olish

	// Umumiy yozuvlar sonini olish
	const [countResult] = await sequelize.query(
		'SELECT COUNT(*) as count FROM category'
	);

	if (countResult) {
		const count = countResult[0].count;

		// Sahifalangan yozuvlarni olish
		const [rows] = await sequelize.query(
			`SELECT * FROM category LIMIT :limit OFFSET :offset`,
			{
				replacements: { limit: limit, offset: offset },
				type: SequalizeORM.Sequelize.QueryTypes.SELECT,
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
