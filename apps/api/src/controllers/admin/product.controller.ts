import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class ProductController {

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, product_category_id, description, price, status, created_by } = req.body;
            const checkExist = await prisma.products.findUnique({
                where: { name },
            });

            if (checkExist) throw new Error("Product sudah terdaftar");

            await prisma.$transaction(async (prisma) => {
                await prisma.products.create({
                    data: {
                        name: name,
                        product_category_id: product_category_id,
                        description: description,
                        price: price,
                        status: status,
                        createdBy: created_by,
                        updatedBy: created_by,
                    },
                });

                // add images here
            });

            res.status(200).send({
                message: 'Success Create Product',
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { name, product_category_id, description, price, status, updated_by } = req.body;

            const checkExist = await prisma.products.findUnique({
                where: { name },
            });

            if (!checkExist) throw new Error("Product Tidak Terdaftar");

            const update = await prisma.products.update({
                where: { id: Number(id) },
                data: {
                    name: name,
                    product_category_id: product_category_id,
                    description: description,
                    price: price,
                    status: status,
                    updatedBy: updated_by,
                    updatedAt: new Date(),
                },
            });

        } catch (error) {
            next(error);
        }
    }

    async getList(req: Request, res: Response, next: NextFunction) {
        try {
            const product = await prisma.products.findMany({
                select: {
                    id: true, name: true
                },
                orderBy: {name: 'asc'}
            });
    
            res.status(200).send({
                message: 'Get Products',
                data: product,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            interface IFilter {
                storeId: number;
                keyword?: string;
                category?: string;
                status?: string;
                page: number;
                pageSize: number;
            }

            const { storeId, keyword, category, status, page, pageSize } = req.query;

            const filter: IFilter = {
                storeId: Number(storeId),
                keyword: keyword ? String(keyword) : '',
                category: category ? String(category) : '',
                status: status ? String(status) : '',
                page: parseInt(page as string) || 1,
                pageSize: parseInt(pageSize as string) || 10,
            };

            const whereCondition: any = {
                AND: [
                    { deletedAt: null },
                    { stock: { store_id : storeId}}
                ],
            };
            
            if (filter.keyword) {
                whereCondition.OR = [
                    { name: { contains: filter.keyword } },
                    { productcategory: { name: { contains: filter.keyword } } }
                ];
            }
            
            if (filter.status !== undefined && filter.status !== '') {
                whereCondition.status = filter.status === 'true' ? true : false;
            }

            const data = await prisma.products.findMany({
                select: {
                    name: true, price: true, description: true, status: true,
                    productcategory: true,
                    stock: true,
                },
                where: whereCondition,
                orderBy: {id : 'desc'},
                skip: filter.page != 1 ? (filter.page - 1) * filter.pageSize : 0,
                take: filter.pageSize,
            })

            res.status(200).send({
                message: 'Get All Category',
                data
            })
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const category = await prisma.products.findUnique({
            where: { id: Number(id) },
        });

        if (!category) throw new Error("Category Tidak Ditemukan");

        res.status(200).send({
            message: 'Get Category By Id',
            data: category,
        })
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const category = await prisma.products.findUnique({
            where: { id: Number(id) },
        });

        if (!category) throw new Error("Category Tidak Terdaftar");

        await prisma.products.delete({
            where: {
                id: Number(id)
            }
        })

        res.status(200).send({
            message: 'Category berhasil dihapus',
        })
    }
}