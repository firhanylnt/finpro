import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class PaymentController {
  //   async paymentProof(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       res.status(200).send({
  //         message: 'Success Proof Upload',
  //       });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  //
  //   async paymentReject(req: Request, res: Response, next: NextFunction) {
  //     try {
  //       res.status(200).send({
  //         message: 'Reject Payment',
  //       });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
}
