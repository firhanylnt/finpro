import { PaymentController } from '../controllers/payment.controller';
import { VerifyToken, AdminGuard } from '../middlewares/authMiddleware';
import { Router } from 'express';

export class PaymentRouter {
  private router: Router;
  private paymentController: PaymentController;

  constructor() {
    this.paymentController = new PaymentController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // this.router.post('/payment-proof', VerifyToken, AdminGuard, this.paymentController.paymentProof);
    // this.router.post('/payment-reject', this.paymentController.paymentReject);
  }

  getRouter(): Router {
    return this.router;
  }
}
