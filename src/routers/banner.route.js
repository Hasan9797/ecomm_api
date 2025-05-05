import { Router } from 'express';
import bannerControllers from '../controllers/banner.controller.js';
import { authenticateToken } from '../middlewares/verfiy.js';
import { upload } from '../helpers/fileHelper.js';
const route = Router();

route.get('/', bannerControllers.getAll);
route.get('/byId/:id', bannerControllers.getById);
route.post(
	'/add',
	authenticateToken,
	upload.single('img'),
	bannerControllers.create
);
route.post(
	'/update/:id',
	authenticateToken,
	upload.single('img'),
	bannerControllers.update
);
route.delete('/delete/:id', authenticateToken, bannerControllers.destroy);

export default route;
