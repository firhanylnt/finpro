
import { UsersController } from '../controllers/admin/users.controller';
import { VerifyToken, AdminGuard } from "../middlewares/authMiddleware";
import { Router } from 'express';
import { RegisterValidation, LoginValidation } from "../middlewares/validations/auth.validation";

export class UsersRouter {
  private router: Router;
  private usersController: UsersController;

  constructor() {
    this.usersController = new UsersController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', VerifyToken, AdminGuard ,this.usersController.getAll);
    this.router.get('/end-users', VerifyToken, AdminGuard ,this.usersController.getAllEndUsers);
    this.router.get('/:id', VerifyToken, AdminGuard,this.usersController.getById);
    this.router.post('/create', VerifyToken, AdminGuard, RegisterValidation, this.usersController.create);
    this.router.patch('/update/:id', VerifyToken, AdminGuard, this.usersController.update);
    this.router.delete('/delete/:id', VerifyToken, AdminGuard, this.usersController.delete);
  }

  getRouter(): Router {
    return this.router;
  }
}