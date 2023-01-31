import { Router } from 'express';
import UserController from '../controller/User.controller';
import teamController from '../controller/Teams.controller';
import matchController from '../controller/Matches.controller';
import LeaderbordController from '../controller/Leaderboard.controller';

const router = Router();

// User Router
router.post('/login', UserController.login);
router.get('/login/validate', UserController.validate);

// Teams Router
router.get('/teams', teamController.getAll);
router.get('/teams/:id', teamController.getOne);

// Matches Router
router.get('/matches', matchController.getByFilter);
router.post('/matches', matchController.createMatche);
router.patch('/matches/:id/finish', matchController.finishMatche);
router.patch('/matches/:id', matchController.updateMatche);

// Leaderboard Router
router.get('/leaderboard/home', LeaderbordController.getAllHomeResultStats);
router.get('/leaderboard/away', LeaderbordController.getAllAwayResultStats);
router.get('/leaderboard/test', LeaderbordController.getTableStats);

export default router;
