import { Router } from 'express';
import authControllers from '../controllers/auth.controller.js';
const route = Router();

route.post('/login', authControllers.login);
route.post('/refresh', authControllers.refreshToken);
route.get('/logout', authControllers.logout);

export default route;
