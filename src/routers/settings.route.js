import { Router } from "express";
import settingsController from "../controllers/settings.controller.js";
import { authenticateToken } from "../middlewares/verfiy.js";
const route = Router();

route.get("/run-seed", settingsController.dbSeed);
route.get("/run-reset", authenticateToken, settingsController.dbReset);

export default route;