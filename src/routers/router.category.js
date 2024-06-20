import { Router } from 'express';
import categoryControllers from '../controllers/controller.category.js';
import { upload } from '../helpers/fileHelper.js';
const route = Router();

route.get('/', categoryControllers.getAll);
route.get('/byId/:id', categoryControllers.getById);
route.post('/add', upload.single('img'), categoryControllers.create);
route.post('/update', upload.single('img'), categoryControllers.update);
route.delete('/delete/:id', categoryControllers.destroy);

export default route;
