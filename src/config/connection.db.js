import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// Connect to PostgreSQL database
export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    port: process.env.DB_PORT,

    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true, // Globally enable timestamps
      underscored: true, // Convert camelCase to snake_case in database columns
      createdAt: "created_at", // Rename createdAt to created_at
      updatedAt: "updated_at", // Rename updatedAt to updated_at
    },
  }
);
