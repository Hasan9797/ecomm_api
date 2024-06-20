import { Router } from "express";
import productControllers from "../controllers/controller.product.js";

import { upload } from "../helpers/fileHelper.js";
const product = Router();

product.get("/", productControllers.getAll);
product.get("/by/:id", productControllers.getById);
product.get("/bycategoryid/:id", productControllers.getProductsByCtegoryId);
product.post("/byids", productControllers.getProductsInOrder);
product.post("/add", upload.single("img"), productControllers.create);
product.post("/update", upload.single("img"), productControllers.update);
product.delete("/delete/:id", productControllers.destroy);

export default product;
