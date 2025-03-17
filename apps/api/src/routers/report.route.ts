
import { ReportController } from '@/controllers/admin/report.controller';
import { Router } from 'express';

export class ReportRouter {
  private router: Router;
  private report: ReportController;

  constructor() {
    this.report = new ReportController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.report.getAll);
    this.router.get('/stock', this.report.getStock);
    this.router.get('/stock/:id', this.report.detailStock);
  }

  getRouter(): Router {
    return this.router;
  }
}