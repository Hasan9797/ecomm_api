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
import categoryRouter from "./routers/router.category.js";
import productRouter from "./routers/router.product.js";
import orderRouter from "./routers/router.order.js";
import reportRouter from "./routers/router.reports.js";
import brandRouter from "./routers/router.brand.js";
import bannerRouter from "./routers/router.banner.js";
import usersRouter from "./routers/router.user.js";
import authRouter from "./routers/router.auth.js";

// import Middlewares
import errorHandler from "./middlewares/errorHandler.js";

//base url
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(express.static(path.join(__dirname, "..", "Uploads")));

app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/report", reportRouter);
app.use("/api/brand", brandRouter);
app.use("/api/banner", bannerRouter);
app.use("/api/user", usersRouter);
app.use("/api/auth", authRouter);

// Error handling middleware
app.use(errorHandler);

// Catch all route for 404 errors
app.use((req, res, next) => {
  const errorFilePath = path.join(__dirname, "errors", "notfound.html");

  res.sendFile(errorFilePath, (err) => {
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
