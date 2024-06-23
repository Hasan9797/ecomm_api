import { Router } from 'express';
import bannerControllers from '../controllers/controllr.banner.js';
import { upload } from '../helpers/fileHelper.js';
const route = Router();

route.get('/', bannerControllers.getAll);
route.get('/byId/:id', bannerControllers.getById);
route.post('/add', upload.single('img'), bannerControllers.create);
route.post('/update', upload.single('img'), bannerControllers.update);
route.delete('/delete/:id', bannerControllers.destroy);

export default route;
