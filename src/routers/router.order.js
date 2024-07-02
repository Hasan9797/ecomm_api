import Router from "express";
import orderControllers from "../controllers/controller.order.js";
const order = Router();

order.get("/", orderControllers.getAll);
order.get("/filter", orderControllers.filter);
order.get("/by/:id", orderControllers.getById);
order.post("/add", orderControllers.create);
order.put("/update/:id", orderControllers.update);

export default order;
