import { DataTypes } from "sequelize";
import db from "../connections/connection.db.js";

const Category = db.define(
  "category",
  {
    title_uz: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title_ru: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      get() {
        return this.getDataValue("createdAt");
      },
    },
    updatedAt: {
      type: DataTypes.INTEGER,
      allowNull: false,
      get() {
        return this.getDataValue("updatedAt");
      },
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate(order) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        order.createdAt = currentTimestamp;
        order.updatedAt = currentTimestamp;
      },
      beforeUpdate(order) {
        order.updatedAt = Math.floor(Date.now() / 1000);
      },
    },
  }
);

export default Category;
