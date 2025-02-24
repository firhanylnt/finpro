import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class MasterDataController {
    async get_roles(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await prisma.roles.findMany({
                where: {deletedAt: null},
                orderBy: {name: 'asc'}
            });

            res.status(200).send({
                message: 'Get All Roles',
                data
            })

        } catch (error) {
            next(error);
        }
    }

    async get_store(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await prisma.stores.findMany({
                where: {deletedAt: null},
                orderBy: {name: 'asc'}
            });

            res.status(200).send({
                message: 'Get All Store',
                data
            })

        } catch (error) {
            next(error);
        }
    }

    async get_product(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await prisma.products.findMany({
                where: {deletedAt: null},
                orderBy: {id: 'desc'}
            });

            res.status(200).send({
                message: 'Get All Products',
                data
            })

        } catch (error) {
            next(error);
        }
    }

    async get_product_category(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await prisma.productCategory.findMany({
                where: {deletedAt: null},
                orderBy: {name: 'asc'}
            });

            res.status(200).send({
                message: 'Get All Category',
                data
            })

        } catch (error) {
            next(error);
        }
    }

    async get_product_by_store(req: Request, res: Response, next: NextFunction) {
        
        try {
            const { store_id } = req.body;

            const whereCondition: any = {};

            if (store_id !== null) {
                whereCondition.store_id = store_id;
                whereCondition.deletedAt = null;
            }
            const data = await prisma.stock.findMany({
                where: whereCondition,
                orderBy: {id: 'desc'}
            });

            res.status(200).send({
                message: 'Get All Products',
                data
            })

        } catch (error) {
            next(error);
        }
    }
}