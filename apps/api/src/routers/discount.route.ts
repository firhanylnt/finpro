
import { DiscountController } from '@/controllers/admin/discount.controller';
import { VerifyToken, AdminGuard } from "../middlewares/authMiddleware";
import { Router } from 'express';

export class DiscountRouter {
  private router: Router;
  private discountController: DiscountController;

  constructor() {
    this.discountController = new DiscountController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', VerifyToken, AdminGuard ,this.discountController.getAll);
    this.router.get('/list', this.discountController.getList);
    this.router.get('/:id', VerifyToken, AdminGuard,this.discountController.getById);
    this.router.post('/create', VerifyToken, AdminGuard, this.discountController.create);
    this.router.patch('/update/:id', VerifyToken, AdminGuard, this.discountController.update);
    this.router.delete('/delete/:id', VerifyToken, AdminGuard, this.discountController.delete);
  }

  getRouter(): Router {
    return this.router;
  }
}