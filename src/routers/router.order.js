import Router from 'express';
import orderControllers from '../controllers/controller.order.js';
const order = Router();

order.get('/', orderControllers.getAll);
order.get('/by/:id', orderControllers.getById);
order.get('/filter-code', orderControllers.getOrdersByProductCode);
order.get('/get-by-user-name', orderControllers.getOrderByUserName);
order.post('/add', orderControllers.create);
order.put('/update/:id', orderControllers.update);

export default order;
