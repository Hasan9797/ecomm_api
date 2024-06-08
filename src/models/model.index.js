import Category from "./model.category.js";
import Product from "./model.product.js";
import Order from "./model.order.js";
import User from "./model.user.js";
import db from "../connections/connection.db.js";

const dataBase = { SQL: db }; //DB connection sequalize

// Models
dataBase.Category = Category;
dataBase.Product = Product;
dataBase.Order = Order;
dataBase.User = User;

dataBase.Category.hasMany(dataBase.Product, {
  as: "products",
  onDelete: "CASCADE",
  constraints: true,
});

dataBase.Product.belongsTo(dataBase.Category, {
  foreignKey: "category_id",
  as: "category",
});

export default dataBase;
