
import { UsersController } from '@/controllers/admin/users.controller';
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
    this.router.get('/', VerifyToken, AdminGuard ,this.usersController.getAllAdmin);
    this.router.get('/:id', VerifyToken, AdminGuard,this.usersController.getAdminById);
    this.router.post('/create', RegisterValidation, this.usersController.createAdmin);
    this.router.patch('/update/:id', RegisterValidation, this.usersController.updateAdmin);
    this.router.delete('/delete/:id', RegisterValidation, this.usersController.deleteAdmin);
  }

  getRouter(): Router {
    return this.router;
  }
}