import Router from "express";
import orderControllers from "../controllers/order.controller.js";
import { authenticateToken } from "../middlewares/verfiy.js";
const order = Router();

order.get("/", authenticateToken, orderControllers.getAll);
order.get("/by/:id", authenticateToken, orderControllers.getById);
order.get(
  "/filter-code",
  // authenticateToken,
  orderControllers.getOrdersByProductCode
);
order.get(
  "/get-by-user-name",
  authenticateToken,
  orderControllers.getOrderByUserName
);
order.get(
  "/get-users-products-info-by-order",
  authenticateToken,
  orderControllers.getUsersInfoByOrder
);
order.post("/add", orderControllers.create);
order.put("/update/:id", authenticateToken, orderControllers.update);

export default order;
