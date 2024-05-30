import { Sequelize, DataTypes } from 'sequelize';

const sequelizeQuery = () => {
	const sequelize = new Sequelize(
		process.env.DB_NAME,
		process.env.DB_USER,
		process.env.DB_PASSWORD,
		{
			host: process.env.DB_HOST,
			dialect: process.env.DB_DIALECT,
		}
	);
	return sequelize;
};

const connectDB = async () => {
	try {
		const sequelize = new Sequelize(
			process.env.DB_NAME,
			process.env.DB_USER,
			process.env.DB_PASSWORD,
			{
				host: process.env.DB_HOST,
				dialect: process.env.DB_DIALECT,
			}
		);
		console.log('Connection has been established successfully.');
		await sequelize.authenticate();
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
};

export const SequalizeORM = {
	Sequelize,
	sequelizeQuery,
	connectDB,
	DataTypes,
};
