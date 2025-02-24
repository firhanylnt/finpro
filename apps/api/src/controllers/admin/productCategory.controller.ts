import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "@/custom";
const prisma = new PrismaClient();

export class ProductCategoryController {

    async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const { name, description } = req.body;
            const checkExist = await prisma.productCategory.findUnique({
                where: { name },
            });

            if (checkExist) throw new Error("Category sudah terdaftar");

            await prisma.$transaction(async (prisma) => {
                await prisma.productCategory.create({
                    data: {
                        name: name,
                        description: description,
                        createdBy: req.admin?.id,
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

    async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            const checkExist = await prisma.productCategory.findUnique({
                where: { id: Number(id) },
            });

            if (!checkExist) throw new Error("Category Tidak Terdaftar");

            const update = await prisma.productCategory.update({
                where: { id: Number(id) },
                data: {
                    name: name,
                    description: description,
                    updatedBy: req.admin?.id,
                    updatedAt: new Date(),
                },
            });

            res.status(200).send({
                message: 'Success update Category',
            });

        } catch (error) {
            next(error);
        }
    }

    async getList(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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

    async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            interface IFilter {
                search?: string;
                sortBy?: string;
                sortOrder?: string;
                page: number;
            }
        
            const { search, sortBy, sortOrder, page } = req.query;
        
            const filter: IFilter = {
                search: search ? String(search) : "",
                sortBy: sortBy ? String(sortBy) : "name",
                sortOrder: sortOrder === "desc" ? "desc" : "asc",
                page: parseInt(page as string) || 1,
            };

            const orderBy: Record<string, "asc" | "desc"> = {};
            if (filter.sortBy) {
                orderBy[filter.sortBy] = filter.sortOrder === "desc" ? "desc" : "asc";
            }

            const data = await prisma.productCategory.findMany({
                select: {
                    id: true, name: true, description: true,
                },
                where: {
                    OR: [
                        { name: { contains: filter.search } },
                    ],
                    AND: [
                        { deletedAt: null }
                    ],
                },
                orderBy,
                skip: filter.page != 1 ? (filter.page - 1) * 10 : 0,
                take: 10,
            })

            res.status(200).send({
                message: 'Get All Category',
                data
            })
        } catch (error) {
            next(error);
        }
    }

    async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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

    async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { id } = req.params;

        const category = await prisma.productCategory.findUnique({
            where: { id: Number(id) },
        });

        if (!category) throw new Error("Category Tidak Terdaftar");

        await prisma.productCategory.update({
            where: { id: Number(id) },
            data: { deletedAt: new Date() }
        })

        res.status(200).send({
            message: 'Category berhasil dihapus',
        })
    }
}