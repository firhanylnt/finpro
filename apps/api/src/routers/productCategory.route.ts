
import { ProductCategoryController } from '@/controllers/admin/productCategory.controller';
import { VerifyToken, AdminGuard } from "../middlewares/authMiddleware";
import { Router } from 'express';

export class ProductCategoryRouter {
  private router: Router;
  private productCategoryController: ProductCategoryController;

  constructor() {
    this.productCategoryController = new ProductCategoryController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', VerifyToken ,this.productCategoryController.getAll);
    this.router.get('/:id', VerifyToken, AdminGuard,this.productCategoryController.getById);
    this.router.post('/create', VerifyToken, AdminGuard, this.productCategoryController.create);
    this.router.patch('/update/:id', VerifyToken, AdminGuard, this.productCategoryController.update);
    this.router.delete('/delete/:id', VerifyToken, AdminGuard, this.productCategoryController.delete);
  }

  getRouter(): Router {
    return this.router;
  }
}