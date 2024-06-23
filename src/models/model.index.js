import Category from './model.category.js';
import Product from './model.product.js';
import Order from './model.order.js';
import User from './model.user.js';
import Banner from './model.banner.js';
import Brand from './model.brand.js';
import db from '../connections/connection.db.js';

const dataBase = {}; //DB connection sequalize

// Models
dataBase.Category = Category;
dataBase.Product = Product;
dataBase.Order = Order;
dataBase.User = User;
dataBase.Banner = Banner;
dataBase.Brand = Brand;
dataBase.SQL = db;

dataBase.Category.hasMany(dataBase.Product, {
	as: 'products',
	onDelete: 'CASCADE',
	constraints: true,
});

dataBase.Product.belongsTo(dataBase.Category, {
	foreignKey: 'category_id',
	as: 'category',
});

dataBase.Category.hasMany(dataBase.Category, {
	as: 'subcategories',
	foreignKey: 'parentId',
});

dataBase.Category.belongsTo(dataBase.Category, {
	as: 'parent',
	foreignKey: 'parentId',
});

export default dataBase;
