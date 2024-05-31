import { DataTypes } from "sequelize";
import db from "../connections/connection.db.js";

const Category = db.define(
  "category",
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
  {
    timestamps: true,
  }
);

export default Category;
