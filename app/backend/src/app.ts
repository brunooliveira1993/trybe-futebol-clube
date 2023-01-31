import * as express from 'express';
import Router from './router/routes';
import Middleware from './middlewares/user.middleware';

class App {
  public app: express.Express;

  constructor() {
    this.app = express();

    this.config();

    // Não remover essa rota
    this.app.get('/', (req, res) => res.json({ ok: true }));
    this.app.post('/login', Middleware.validationFilds, Router);
    this.app.get('/login/validate', Router);
    this.app.get('/teams', Router);
    this.app.get('/teams/:id', Router);
    this.app.get('/matches', Router);
    this.app.get('/leaderboard/home', Router);
    this.app.get('/leaderboard/away', Router);
    this.app.get('/leaderboard', Router);
    this.app.post('/matches', Middleware.validationToken, Middleware.validationTeams, Router);
    this.app.patch('/matches/:id/finish', Middleware.validationToken, Router);
    this.app.patch('/matches/:id', Middleware.validationToken, Router);
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(express.json());
    this.app.use(accessControl);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export { App };

// Essa segunda exportação é estratégica, e a execução dos testes de cobertura depende dela
export const { app } = new App();
