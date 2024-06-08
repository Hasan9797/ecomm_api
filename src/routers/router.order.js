import Router from 'express';
import { create, getAll, getById } from '../controllers/controller.order.js';
const order = Router();

order.get('/', getAll);
order.get('/by/:id', getById);
order.post('/add', create);

export default order;
