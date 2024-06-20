import { Router } from 'express';
import productControllers from '../controllers/controller.product.js';

import { upload } from '../helpers/fileHelper.js';
const route = Router();

route.get('/', productControllers.getAll);
route.get('/by/:id', productControllers.getById);
route.get('/bycategoryid/:id', productControllers.getProductsByCtegoryId);
route.post('/byids', productControllers.getProductsInOrder);
route.post('/add', upload.single('img'), productControllers.create);
route.post('/update', upload.single('img'), productControllers.update);
route.delete('/delete/:id', productControllers.destroy);

export default route;
