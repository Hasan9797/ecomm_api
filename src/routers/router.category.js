import { Router } from "express";
import categoryControllers from "../controllers/controller.category.js";
import { upload } from "../helpers/fileHelper.js";
const category = Router();

category.get("/", categoryControllers.getAll);
category.get("/byId/:id", categoryControllers.getById);
category.post("/add", upload.single("img"), categoryControllers.create);
category.post("/update", upload.single("img"), categoryControllers.update);
category.delete("/delete/:id", categoryControllers.destroy);

export default category;
