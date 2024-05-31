import Category from "./model.category.js";
import Product from "./model.product.js";
import db from "../connections/connection.db.js";

const dataBase = { Query: db };

dataBase.Category = Category;
dataBase.Product = Product;

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
