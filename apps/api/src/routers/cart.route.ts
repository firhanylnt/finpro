import { CartController } from '@/controllers/cart.controller';
import { VerifyToken, AdminGuard } from '../middlewares/authMiddleware';
import { Router } from 'express';

export class CartRouter {
  private router: Router;
  private cart: CartController;

  constructor() {
    this.cart = new CartController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // this.router.get('/cart', VerifyToken, AdminGuard, this.cart.getAll);
    // this.router.get('/cart', VerifyToken, AdminGuard, this.cart.getList);
    // this.router.get('/cart/:id', VerifyToken, AdminGuard, this.cart.getById);
    // this.router.post('/cart', VerifyToken, AdminGuard, this.cart.create);
    // this.router.patch('/cart/:id', VerifyToken, AdminGuard, this.cart.update);
    // this.router.delete('/cart/:id', VerifyToken, AdminGuard, this.cart.delete);
  }

  getRouter(): Router {
    return this.router;
  }
}
