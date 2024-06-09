import { Router } from "express";
import categoryControllers from "../controllers/controller.category.js";
const category = Router();

category.get("/", categoryControllers.getAll);
category.post("/add", categoryControllers.create);

export default category;
