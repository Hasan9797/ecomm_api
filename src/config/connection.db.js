import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const dbName = process.env.DB_NAME;
const sbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbHost = process.env.DB_HOST;
const dbPort = process.env.DB_PORT;

// Connect to PostgreSQL database
export const sequelize = new Sequelize(dbName, sbUser, String(dbPassword), {
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
});
