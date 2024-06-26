import { Router } from "express";
import usersControllers from "../controllers/constroller.users.js";
import { authenticateToken } from "../middlewares/verfiy.js";
const route = Router();

route.get("/", authenticateToken, usersControllers.getAll);
route.get("/profile", authenticateToken, usersControllers.getById);
route.post("/add", authenticateToken, usersControllers.create);
route.post("/update/:id", authenticateToken, usersControllers.update);
route.delete("/delete/:id", authenticateToken, usersControllers.destroy);

export default route;
