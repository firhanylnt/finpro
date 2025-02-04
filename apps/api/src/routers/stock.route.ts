
import { StockController } from '@/controllers/admin/stock.controller';
import { VerifyToken, AdminGuard } from "../middlewares/authMiddleware";
import { Router } from 'express';

export class StockRouter {
  private router: Router;
  private stockController: StockController;

  constructor() {
    this.stockController = new StockController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/create', VerifyToken, AdminGuard, this.stockController.create);
    this.router.patch('/update/:id', VerifyToken, AdminGuard, this.stockController.update);
  }

  getRouter(): Router {
    return this.router;
  }
}