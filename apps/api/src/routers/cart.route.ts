import { CartController } from '../controllers/cart.controller';
import { VerifyToken, AdminGuard } from '../middlewares/authMiddleware';
import { Router } from 'express';

export class CartRouter {
  private router: Router;
  private cartController: CartController;

  constructor() {
    this.cartController = new CartController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // this.router.get('/cart', VerifyToken, AdminGuard, this.cartController.getAll);
    // this.router.get('/cart', VerifyToken, AdminGuard, this.cartController.getList);
    // this.router.get('/cart/:id', VerifyToken, AdminGuard, this.cartController.getById);
    // this.router.post('/cart', VerifyToken, AdminGuard, this.cartController.create);
    // this.router.patch('/cart/:id', VerifyToken, AdminGuard, this.cartController.update);
    // this.router.delete('/cart/:id', VerifyToken, AdminGuard, this.cartController.delete);
  }

  getRouter(): Router {
    return this.router;
  }
}
