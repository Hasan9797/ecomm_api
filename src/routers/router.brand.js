import { Router } from 'express';
import brandControllers from '../controllers/controller.brand.js';
import { upload } from '../helpers/fileHelper.js';
const route = Router();

route.get('/', brandControllers.getAll);
route.get('/byId/:id', brandControllers.getById);
route.post('/add', upload.single('img'), brandControllers.create);
route.post('/update/:id', upload.single('img'), brandControllers.update);
route.delete('/delete/:id', brandControllers.destroy);

export default route;
