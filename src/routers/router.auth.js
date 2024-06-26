import { Router } from 'express';
import authControllers from '../controllers/controller.auth.js';
const route = Router();

route.post('/login', authControllers.login);
route.post('/refresh', authControllers.refreshToken);
route.post('/logout', authControllers.logout);

export default route;
