import { Router } from "express";
import {
  create,
  getAll,
  getByIds,
  update,
} from "../controllers/controller.product.js";

import { upload } from "../helpers/fileHelper.js";
const product = Router();

product.get("/", getAll);
product.post("/getByIds", getByIds);
product.post("/add", upload.single("img"), create);
product.post("/update", upload.single("img"), update);

export default product;
