
import { MasterDataController } from '@/controllers/admin/masterdata.controller';
import { VerifyToken, AdminGuard } from "../middlewares/authMiddleware";
import { Router } from 'express';

export class MasterDataRouter {
  private router: Router;
  private masterDataController: MasterDataController;

  constructor() {
    this.masterDataController = new MasterDataController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/products', VerifyToken ,this.masterDataController.get_product);
    this.router.post('/stock', VerifyToken ,this.masterDataController.get_product_by_store);
    this.router.get('/categories', VerifyToken ,this.masterDataController.get_product_category);
    this.router.get('/stores', VerifyToken ,this.masterDataController.get_store);
    this.router.get('/roles', VerifyToken ,this.masterDataController.get_roles);
    this.router.get('/discount-type', VerifyToken ,this.masterDataController.get_discount_type);
  }

  getRouter(): Router {
    return this.router;
  }
}