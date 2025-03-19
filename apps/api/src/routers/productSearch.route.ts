
import { ProductSearchController } from '../controllers/user/product.controller';
import { Router } from 'express';

export class ProductSearchRouter {
  private router: Router;
  private product: ProductSearchController;

  constructor() {
    this.product = new ProductSearchController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.product.getAll);
    this.router.get('/:id', this.product.getById);
  }

  getRouter(): Router {
    return this.router;
  }
}