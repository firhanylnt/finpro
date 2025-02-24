
import { MasterDataController } from '@/controllers/admin/masterdata.controller';
import { VerifyToken, AdminGuard } from "../middlewares/authMiddleware";
import { Router } from 'express';

export class MasterDataRouter {
  private router: Router;
  private discountController: MasterDataController;

  constructor() {
    this.discountController = new MasterDataController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/products', VerifyToken, AdminGuard ,this.discountController.get_product);
    this.router.post('/stock', VerifyToken, AdminGuard ,this.discountController.get_product_by_store);
    this.router.get('/categories', VerifyToken, AdminGuard ,this.discountController.get_product_category);
    this.router.get('/stores', VerifyToken, AdminGuard ,this.discountController.get_store);
    this.router.get('/roles', VerifyToken, AdminGuard ,this.discountController.get_roles);
  }

  getRouter(): Router {
    return this.router;
  }
}