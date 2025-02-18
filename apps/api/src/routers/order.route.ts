import { OrderController } from '@/controllers/order.controller';
import { VerifyToken, AdminGuard } from '../middlewares/authMiddleware';
import { Router } from 'express';

export class OrderRouter {
  private router: Router;
  private orderController: OrderController;

  constructor() {
    this.orderController = new OrderController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // this.router.post('/find-store', VerifyToken, AdminGuard, this.orderController.findStore);
    // this.router.post('/check-stock', VerifyToken, AdminGuard, this.orderController.checkStock);
    // this.router.post('/create', VerifyToken, AdminGuard, this.orderController.create);
    // this.router.post('/cancel', VerifyToken, AdminGuard, this.orderController.cancel);
    // this.router.get('/:id', VerifyToken, AdminGuard,this.orderController.getUserById);
    // this.router.get('/order', this.orderController.getAll);
    // this.router.get('/order/:id', VerifyToken, AdminGuard,this.orderController.getOrderById);
  }

  getRouter(): Router {
    return this.router;
  }
}
