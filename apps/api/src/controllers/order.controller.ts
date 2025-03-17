import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { findStore } from '@/utils/findStore';
const prisma = new PrismaClient();

export class OrderController {
  //   async findStore(req: Request, res: Response, next: NextFunction) {
  //     try {
  //      res.status(200).send({
  //        message: 'Store found',
  //        data: store,
  //      });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  //
  //   async checkStock(req: Request, res: Response, next: NextFunction) {
  //     try {
  //      res.status(200).send({
  //        message: 'Stock checked',
  //        data: stock,
  //      });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  //
  //   async create(req: Request, res: Response, next: NextFunction) {
  //     try {
  //      res.status(200).send({
  //        message: 'Order created',
  //        data: order,
  //      });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  //
  //   async cancel(req: Request, res: Response, next: NextFunction) {
  //     try {
  //      res.status(200).send({
  //        message: 'Order declined',
  //        data: order,
  //      });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  //
  //   async getUserById(req: Request, res: Response, next: NextFunction) {
  //     try {
  //      res.status(200).send({
  //        message: 'User found',
  //        data: user,
  //      });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  //
  //   async getOrderById(req: Request, res: Response, next: NextFunction) {
  //     try {
  //      res.status(200).send({
  //        message: 'Order found',
  //        data: order,
  //      });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  //
  //   async getAll(req: Request, res: Response, next: NextFunction) {
  //     try {
  //      res.status(200).send({
  //        message: 'Get All Order',
  //        data: order,
  //      });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
}
