
import { ProductController } from '@/controllers/admin/product.controller';
import { VerifyToken, AdminGuard } from "../middlewares/authMiddleware";
import { Router } from 'express';

export class ProductRouter {
  private router: Router;
  private product: ProductController;

  constructor() {
    this.product = new ProductController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', VerifyToken, AdminGuard ,this.product.getAll);
    this.router.get('/list', this.product.getList);
    this.router.get('/:id', VerifyToken, AdminGuard,this.product.getById);
    this.router.post('/create', VerifyToken, AdminGuard, this.product.create);
    this.router.patch('/update/:id', VerifyToken, AdminGuard, this.product.update);
    this.router.delete('/delete/:id', VerifyToken, AdminGuard, this.product.delete);
  }

  getRouter(): Router {
    return this.router;
  }
}