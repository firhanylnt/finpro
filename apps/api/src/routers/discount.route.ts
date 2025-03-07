
import { DiscountController } from '@/controllers/admin/discount.controller';
import { VerifyToken } from "../middlewares/authMiddleware";
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
    this.router.get('/', VerifyToken ,this.discountController.getAll);
    this.router.get('/:id', VerifyToken,this.discountController.getById);
    this.router.post('/create', VerifyToken, this.discountController.create);
    this.router.patch('/update/:id', VerifyToken, this.discountController.update);
    this.router.delete('/delete/:id', VerifyToken, this.discountController.delete);
  }

  getRouter(): Router {
    return this.router;
  }
}