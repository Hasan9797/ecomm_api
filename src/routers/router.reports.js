import Router from 'express';
import reportControllers from '../controllers/controller.reports.js';
const order = Router();

order.get('/', reportControllers.getAllReports);
order.get('/user', reportControllers.getUserReport);

export default order;
