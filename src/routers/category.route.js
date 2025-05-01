import { Router } from "express";
import categoryControllers from "../controllers/controller.category.js";
import clientCategoryControllers from "../controllers/client/controller.category.js";
import { upload } from "../helpers/fileHelper.js";
import { authenticateToken } from "../middlewares/verfiy.js";
const route = Router();

route.get("/", categoryControllers.getAll);
route.get("/parent", clientCategoryControllers.getAll);
route.get("/byId/:id", categoryControllers.getById);
route.post(
  "/add",
  authenticateToken,
  upload.single("img"),
  categoryControllers.create
);
route.post(
  "/update/:id",
  authenticateToken,
  upload.single("img"),
  categoryControllers.update
);
route.delete("/delete/:id", authenticateToken, categoryControllers.destroy);

export default route;
