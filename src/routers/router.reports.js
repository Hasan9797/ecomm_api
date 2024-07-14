import Router from 'express';
import reportControllers from '../controllers/controller.reports.js';
const order = Router();

order.get('/', reportControllers.getAllReports);
order.get('/user', reportControllers.getUserReport);
order.get(
	'/products-in-maxcount',
	reportControllers.getProductsInCountMaxByOrder
);
order.get('/clients-in-maxcount', reportControllers.getUsersInCountMaxByOrder);

export default order;
