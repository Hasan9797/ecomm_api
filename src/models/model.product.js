import { DataTypes } from "sequelize";
import db from "../connections/connection.db.js";
import productEnum from "../enums/product_enum.js";

const Product = db.define(
  "product",
  {
    title_uz: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title_ru: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gallery: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: true,
    },
    money_type: {
      type: DataTypes.STRING,
      defaultValue: "usd",
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: productEnum.STATUS_CREATE,
      allowNull: false,
    },
    characteristic: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    description_uz: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description_ru: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "categories", // foreign key bo'lgan jadval nomi
        key: "id",
      },
    },
    created_at: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: () => Math.floor(Date.now() / 1000),
      get() {
        return this.getDataValue("created_at");
      },
    },
    updated_at: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: () => Math.floor(Date.now() / 1000),
      get() {
        return this.getDataValue("updated_at");
      },
    },
  },
  {
    indexes: [
      {
        fields: ["title_uz"],
      },
      {
        fields: ["title_ru"],
      },
      {
        fields: ["code"],
      },
      {
        fields: ["category_id"],
      },
      {
        fields: ["price"],
      },
      {
        fields: ["createdAt"],
      },
    ],
  },
  {
    timestamps: true,
    hooks: {
      beforeCreate(order) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        order.created_at = currentTimestamp;
        order.updated_at = currentTimestamp;
      },
      beforeUpdate(order) {
        order.updated_at = Math.floor(Date.now() / 1000);
      },
    },
  }
);

export default Product;
