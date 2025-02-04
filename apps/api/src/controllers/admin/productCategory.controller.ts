import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { genSalt, hash, compare } from "bcrypt";
const prisma = new PrismaClient();

export class ProductCategoryController {

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, description, created_by } = req.body;
            const checkExist = await prisma.productCategory.findUnique({
                where: { name },
            });

            if (checkExist) throw new Error("Category sudah terdaftar");

            await prisma.$transaction(async (prisma) => {
                await prisma.productCategory.create({
                    data: {
                        name: name,
                        description: description,
                        createdBy: created_by,
                    },
                });
            });

            res.status(200).send({
                message: 'Success Create Category',
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { name, description, updated_by } = req.body;

            const checkExist = await prisma.productCategory.findUnique({
                where: { name },
            });

            if (!checkExist) throw new Error("Category Tidak Terdaftar");

            const update = await prisma.productCategory.update({
                where: { id: Number(id) },
                data: {
                    name: name,
                    description: description,
                    updatedBy: updated_by,
                    updatedAt: new Date(),
                },
            })

        } catch (error) {
            next(error);
        }
    }

    async getList(req: Request, res: Response, next: NextFunction) {
        try {
            const category = await prisma.productCategory.findMany({
                select: {
                    id: true, name: true
                },
                orderBy: {name: 'asc'}
            });
    
            res.status(200).send({
                message: 'List Products Category',
                data: category,
            });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            interface IFilter {
                keyword?: string;
                page: number;
                pageSize: number;
            }

            const { keyword, page, pageSize } = req.query;

            const filter: IFilter = {
                keyword: keyword ? String(keyword) : '',
                page: parseInt(page as string) || 1,
                pageSize: parseInt(pageSize as string) || 10,
            };

            const data = await prisma.productCategory.findMany({
                select: {
                    name: true, description: true,
                },
                where: {
                    OR: [
                        { name: { contains: filter.keyword } },
                    ],
                    AND: [
                        { deletedAt: null }
                    ],
                },
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

        const category = await prisma.productCategory.findUnique({
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

        const category = await prisma.productCategory.findUnique({
            where: { id: Number(id) },
        });

        if (!category) throw new Error("Category Tidak Terdaftar");

        await prisma.productCategory.delete({
            where: {
                id: Number(id)
            }
        })

        res.status(200).send({
            message: 'Category berhasil dihapus',
        })
    }
}