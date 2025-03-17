
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
    this.router.get('/', VerifyToken ,this.stockController.getAll);
    this.router.post('/create', VerifyToken, this.stockController.create);
    this.router.patch('/update/:id', VerifyToken, this.stockController.update);
  }

  getRouter(): Router {
    return this.router;
  }
}