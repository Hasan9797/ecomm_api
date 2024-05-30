import { DataTypes, Model } from "sequelize";
import { db } from "./connections/connection.db.js";
import Category from "./model.category.js";

class Product extends Model {}

Product.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // categoryId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
  },
  { db, modelName: "Product" }
);

Product.belongsTo(Category, {
  foreignKey: "categoryId",
});

export default Product;
