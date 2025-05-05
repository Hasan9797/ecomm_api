import Router from 'express';
import reportControllers from '../controllers/reports.controller.js';
import { authenticateToken } from '../middlewares/verfiy.js';
const order = Router();

order.get('/', authenticateToken, reportControllers.getAllReports);
order.get('/user', authenticateToken, reportControllers.getUserReport);
order.get(
	'/products-in-maxcount',
	authenticateToken,
	reportControllers.getProductsInCountMaxByOrder
);
order.get(
	'/clients-in-maxcount',
	authenticateToken,
	reportControllers.getUsersInCountMaxByOrder
);

export default order;
