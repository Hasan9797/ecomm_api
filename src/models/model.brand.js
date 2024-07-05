import { DataTypes } from "sequelize";
import db from "../connections/connection.db.js";

const Brand = db.define(
  "brand",
  {
    name_uz: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name_ru: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
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
      beforeCreate(brand) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        brand.created_at = currentTimestamp;
        brand.updated_at = currentTimestamp;
      },
      beforeUpdate(brand) {
        brand.updated_at = Math.floor(Date.now() / 1000);
      },
    },
  }
);

export default Brand;
