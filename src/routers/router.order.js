import Router from "express";
import orderControllers from "../controllers/controller.order.js";
const order = Router();

order.get("/creating", orderControllers.getAllByCreated);
order.get("/waiting", orderControllers.getAllByWaiting);
order.get("/success", orderControllers.getAllBySuccess);
order.get("/inactive", orderControllers.getAllByInactive);
order.get("/by/:id", orderControllers.getById);
order.post("/add", orderControllers.create);

export default order;
