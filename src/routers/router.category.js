import { Router } from "express";
import categoryControllers from "../controllers/controller.category.js";
import { upload } from "../helpers/fileHelper.js";
import { authenticateToken } from "../middlewares/verfiy.js";
const route = Router();

route.get("/", categoryControllers.getAll);
route.get("/byId/:id", categoryControllers.getById);
route.post("/add", upload.single("img"), categoryControllers.create);
route.post("/update/:id", upload.single("img"), categoryControllers.update);
route.delete("/delete/:id", categoryControllers.destroy);

export default route;
