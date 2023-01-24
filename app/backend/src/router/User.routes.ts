import { Router } from 'express';
import UserController from '../controller/User.controller';

const router = Router();

router.post('/login', UserController.login);
router.get('/login/validate', UserController.validate);

export default router;
