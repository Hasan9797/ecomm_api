import { Router } from 'express';
import {
	create,
	getAll,
	getById,
	getProductsInOrder,
	update,
} from '../controllers/controller.product.js';

import { upload } from '../helpers/fileHelper.js';
const product = Router();

product.get('/', getAll);
product.get('/by/:id', getById);
product.post('/getByIds', getProductsInOrder);
product.post('/add', upload.single('img'), create);
product.post('/update', upload.single('img'), update);

export default product;
