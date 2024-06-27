import { Router } from "express";
import productControllers from "../controllers/controller.product.js";

import { upload } from "../helpers/fileHelper.js";
import { authenticateToken } from "../middlewares/verfiy.js";
const route = Router();

route.get("/", productControllers.getAll);
route.get("/byId/:id", productControllers.getById);
route.get("/bycategoryid/:id", productControllers.getProductsByCtegoryId);
route.post("/byids", productControllers.getProductsInOrder);
route.post(
  "/add",
  authenticateToken,
  upload.fields([
    { name: "img", maxCount: 1 }, // Bitta img fayli
    { name: "gallery", maxCount: 5 }, // Bir nechta gallery fayllari
  ]),
  productControllers.create
);
route.post(
  "/update/:id",
  authenticateToken,
  upload.single("img"),
  productControllers.update
);
route.get("/search", productControllers.searchProducts);
route.delete("/delete/:id", authenticateToken, productControllers.destroy);

export default route;
