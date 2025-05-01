import { Router } from 'express';
import brandControllers from '../controllers/controller.brand.js';
import { authenticateToken } from '../middlewares/verfiy.js';
import { upload } from '../helpers/fileHelper.js';
const route = Router();

route.get('/', brandControllers.getAll);
route.get('/byId/:id', brandControllers.getById);
route.post(
	'/add',
	authenticateToken,
	upload.single('img'),
	brandControllers.create
);
route.post(
	'/update/:id',
	authenticateToken,
	upload.single('img'),
	brandControllers.update
);
route.delete('/delete/:id', authenticateToken, brandControllers.destroy);

export default route;
