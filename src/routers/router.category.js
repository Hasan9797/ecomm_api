import { Router } from "express";
import { create, getAll } from "../controllers/controller.category.js";
const category = Router();

category.get("/", getAll);
category.get("/add", create);

export default category;
