import { Router } from "express";
import usersControllers from "../controllers/controller.users.js";
import {
  authenticateToken,
  authorizeRoleSuperAdmin,
} from "../middlewares/verfiy.js";
const route = Router();

route.get("/", authenticateToken, usersControllers.getAll);
route.get("/me", authenticateToken, usersControllers.getMe);

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
  usersControllers.distroy
);

route.get("/:id", authenticateToken, authorizeRoleSuperAdmin, usersControllers.getById);

export default route;
