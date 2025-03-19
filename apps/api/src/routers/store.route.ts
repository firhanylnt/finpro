
import { VerifyToken, AdminGuard } from "../middlewares/authMiddleware";
import { Router } from 'express';
import { StoreController } from '../controllers/admin/store.controller';

export class StoreRouter {
  private router: Router;
  private storeController: StoreController;

  constructor() {
    this.storeController = new StoreController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', VerifyToken ,this.storeController.getAll);
    this.router.get('/:id', VerifyToken, AdminGuard,this.storeController.getById);
    this.router.post('/create', VerifyToken, AdminGuard, this.storeController.create);
    this.router.patch('/update/:id', VerifyToken, AdminGuard, this.storeController.update);
    this.router.delete('/delete/:id', VerifyToken, AdminGuard, this.storeController.delete);
  }

  getRouter(): Router {
    return this.router;
  }
}