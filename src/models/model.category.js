import { DataTypes, Model } from "sequelize";
import { db } from "./connections/connection.db.js";
import Product from "./model.product.js";

class Category extends Model {}

Category.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { db, modelName: "Category" }
);

Category.hasMany(Product, {
  foreignKey: "categoryId",
});

export default Category;
