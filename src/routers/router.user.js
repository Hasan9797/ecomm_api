import { Router } from 'express';
import usersControllers from '../controllers/constroller.users.js';
const route = Router();

route.get('/', usersControllers.getAll);
route.get('/byId/:id', usersControllers.getById);
route.post('/add', usersControllers.create);
route.post('/update/:id', usersControllers.update);
route.delete('/delete/:id', usersControllers.destroy);

export default route;
