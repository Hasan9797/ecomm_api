import { Router } from "express";
import usersControllers from "../controllers/constroller.users.js";
import {
  authenticateToken,
  authorizeRoleSuperAdmin,
} from "../middlewares/verfiy.js";
const route = Router();

route.get("/", authenticateToken, usersControllers.getAll);
route.post("/generate", usersControllers.generateUser);
route.get("/profile", authenticateToken, usersControllers.getById);
route.post(
  "/add",
  authenticateToken,
  authorizeRoleSuperAdmin,
  usersControllers.create
);
route.put(
  "/update/:id",
  authenticateToken,
  authorizeRoleSuperAdmin,
  usersControllers.update
);
route.delete(
  "/delete/:id",
  authenticateToken,
  authorizeRoleSuperAdmin,
  usersControllers.destroy
);

export default route;
