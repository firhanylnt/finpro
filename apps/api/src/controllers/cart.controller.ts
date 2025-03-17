import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export class CartController {
  // async getAll(req: Request, res: Response, next: NextFunction) {
  //     try {
  //      res.status(200).send({
  //        message: 'Get All Cart',
  //        data: cart,
  //      });
  //    } catch (error) {
  //       next(error);
  //     }
  // }
  //
  // async getList(req: Request, res: Response, next: NextFunction) {
  //      try {
  //        const response = await prisma.product.findMany();
  //        res.status(200).json(response);
  //      } catch (error) {
  //        next(error);
  //      }
  // }
  //
  // async getById(req: Request, res: Response, next: NextFunction) {
  //     const response = await prisma.cart.findUnique({
  //       where: {
  //         id: Number(req.params.id),
  //       },
  //     });
  //     if (!response) throw new Error('Not Found');
  //      res.status(200).json(response);
  // }
  //
  // async create(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     res.status(200).send({
  //       message: 'Create Cart Success',
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  //
  // async update(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     res.status(200).send({
  //       message: 'Update Cart Success',
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  //
  // async delete(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     res.status(200).send({
  //       message: 'Delete Cart Success',
  //     });
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}
