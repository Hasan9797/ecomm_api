import Router from 'express';
import orderControllers from '../controllers/controller.order.js';
const order = Router();

order.get('/', orderControllers.getAll);
order.get('/by/:id', orderControllers.getById);
order.post('/add', orderControllers.create);

export default order;
