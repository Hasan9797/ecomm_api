import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import env from "dotenv";
import { sequelize } from "./config/connection.db.js";

const app = express();
env.config();

// CORS middleware
app.use(cors());

// import Routers
import categoryRouter from "./routers/category.route.js";
import productRouter from "./routers/product.route.js";
import orderRouter from "./routers/order.route.js";
import reportRouter from "./routers/reports.route.js";
import brandRouter from "./routers/brand.route.js";
import bannerRouter from "./routers/banner.route.js";
import usersRouter from "./routers/user.route.js";
import authRouter from "./routers/auth.route.js";
import settingsRouter from "./routers/settings.route.js";

// Cron Jobs
import cronJob from "./job/cronjob.js";
cronJob();

// import Middlewares
import errorHandler from "./middlewares/errorHandler.js";

//base url
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "..", "Uploads")));

app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/report", reportRouter);
app.use("/api/brand", brandRouter);
app.use("/api/banner", bannerRouter);
app.use("/api/user", usersRouter);
app.use("/api/auth", authRouter);
app.use("/api/settings", settingsRouter);

// Error handling middleware
app.use(errorHandler);

// Catch all route for 404 errors
app.use((req, res, next) => {
  const errorFilePath = path.join(__dirname, "errors", "notfound.html");

  res.status(404).sendFile(errorFilePath, (err) => {
    if (err) {
      console.error("Faylni jo'natishda xato:", err);
      res.status(500).send("Server ichki xato");
    }
  });
});

// Server Port
const PORT = process.env.PORT || 8000;

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}:...`);
    });

    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // await sequelize.sync({ force: true });
    // console.log('Database synchronized');
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
start();
