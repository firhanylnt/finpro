
import { AuthController } from '@/controllers/admin/auth.controller';
import { Router } from 'express';
import { LoginValidation } from "../middlewares/validations/auth.validation";

export class AuthRouter {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/login', LoginValidation, this.authController.login);
  }

  getRouter(): Router {
    return this.router;
  }
}