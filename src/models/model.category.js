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
      allowNull: true,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "categories", // foreign key bo'lgan jadval nomi
        key: "id",
      },
    },
    created_at: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: () => Math.floor(Date.now() / 1000),
      get() {
        return this.getDataValue("created_at");
      },
    },
    updated_at: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: () => Math.floor(Date.now() / 1000),
      get() {
        return this.getDataValue("updated_at");
      },
    },
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate(category) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        category.created_at = currentTimestamp;
        category.updated_at = currentTimestamp;
      },
      beforeUpdate(category) {
        category.updated_at = Math.floor(Date.now() / 1000);
      },
    },
  }
);

export default Category;
