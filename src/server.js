import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import env from "dotenv";
import db from "./connections/connection.db.js";
import categoryRouter from "./routers/router.category.js";
import productRouter from "./routers/router.product.js";

// const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
env.config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "Uploads")));

app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
// app.use("/api/order");
// app.use("/api/user");

const PORT = process.env.PORT || 8000;

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}:...`);
    });

    await db.authenticate();
    console.log("Connection has been established successfully.");

    // await db.sync({ force: true });
    // console.log("Database synchronized");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

start();
