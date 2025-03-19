
import { ProductController } from '../controllers/admin/product.controller';
import { VerifyToken, AdminGuard } from "../middlewares/authMiddleware";
import { Router } from 'express';
import upload from '@/middlewares/uploadMiddleware';

export class ProductRouter {
  private router: Router;
  private product: ProductController;

  constructor() {
    this.product = new ProductController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', VerifyToken ,this.product.getAll);
    this.router.get('/:id', VerifyToken ,this.product.getById);
    this.router.post('/create', VerifyToken, AdminGuard, upload.array("images", 5), this.product.create);
    this.router.patch('/update/:id', VerifyToken, AdminGuard, upload.array("images", 5), this.product.update);
    this.router.delete('/delete/:id', VerifyToken, AdminGuard, this.product.delete);
  }

  getRouter(): Router {
    return this.router;
  }
}