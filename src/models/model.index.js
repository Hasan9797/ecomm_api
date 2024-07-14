import { Sequelize } from 'sequelize';
import Category from './model.category.js';
import Product from './model.product.js';
import Order from './model.order.js';
import User from './model.user.js';
import Banner from './model.banner.js';
import Brand from './model.brand.js';
import { sequelize } from '../config/connection.db.js';

const db = {
	SQL: sequelize,
	Category,
	Product,
	Order,
	User,
	Banner,
	Brand,
};

// const sequelize = new Sequelize(process.env[config.use_env_variable], config);

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
