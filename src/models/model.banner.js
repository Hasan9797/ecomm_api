import { DataTypes } from "sequelize";
import db from "../connections/connection.db.js";

const Banner = db.define(
  "banner",
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
      beforeCreate(banner) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        banner.created_at = currentTimestamp;
        banner.updated_at = currentTimestamp;
      },
      beforeUpdate(banner) {
        banner.updated_at = Math.floor(Date.now() / 1000);
      },
    },
  }
);

export default Banner;
