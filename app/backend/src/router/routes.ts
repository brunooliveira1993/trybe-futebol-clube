import { Router } from 'express';
import UserController from '../controller/User.controller';
import teamController from '../controller/Teams.controller';
import matchController from '../controller/Matches.controller';

const router = Router();

// User Router
router.post('/login', UserController.login);
router.get('/login/validate', UserController.validate);

// Teams Router
router.get('/teams', teamController.getAll);
router.get('/teams/:id', teamController.getOne);

// Matches Router
router.get('/matches', matchController.getAll);

export default router;
