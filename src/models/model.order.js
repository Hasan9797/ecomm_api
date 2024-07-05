import { DataTypes } from "sequelize";
import db from "../connections/connection.db.js";
import orderEnum from "../enums/order_enum.js";

const Order = db.define(
  "order",
  {
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: orderEnum.STATUS_CREATE,
      allowNull: false,
    },
    products: {
      type: DataTypes.JSON,
      allowNull: false,
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

export default Order;
