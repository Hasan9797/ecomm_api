// src/models/model.user.js

import { DataTypes } from "sequelize";
import db from "../connections/connection.db.js";
import user_enum from "../enums/user_enum.js";

const User = db.define(
  "users",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.INTEGER,
      defaultValue: user_enum.ROLE_USER_ADMIN,
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: user_enum.STATUS_CREATE,
      allowNull: false,
    },
    login: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: Math.floor(Date.now() / 1000),
      get() {
        return this.getDataValue("created_at");
      },
    },
    updated_at: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: Math.floor(Date.now() / 1000),
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

export default User;
