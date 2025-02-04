import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { genSalt, hash, compare } from "bcrypt";
const prisma = new PrismaClient();

export class DiscountController {

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, discount_type_id, start_date, end_date, status, created_by } = req.body;

            await prisma.$transaction(async (prisma) => {
                await prisma.discount.create({
                    data: {
                        name: name,
                        discount_type_id: discount_type_id,
                        start_date: start_date,
                        end_date: end_date,
                        status: status,
                        createdBy: created_by,
                        updatedBy: created_by,
                    },
                });
            });

            res.status(200).send({
                message: 'Success Create Discount',
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { name, discount_type_id, start_date, end_date, status, updated_by } = req.body;

            const checkExist = await prisma.discount.findUnique({
                where: { id : Number(id) },
            });

            if (!checkExist) throw new Error("Discount Tidak Terdaftar");

            const update = await prisma.discount.update({
                where: { id: Number(id) },
                data: {
                    name: name,
                    discount_type_id: discount_type_id,
                    start_date: start_date,
                    end_date: end_date,
                    status: status,
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
            const category = await prisma.discount.findMany({
                select: {
                    id: true, name: true
                },
                orderBy: {name: 'asc'}
            });
    
            res.status(200).send({
                message: 'List Discount',
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

            const data = await prisma.discount.findMany({
                select: {
                    name: true,
                    discount_type_id: true,
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
                message: 'Get All Discount',
                data
            })
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const category = await prisma.discount.findUnique({
            where: { id: Number(id) },
        });

        if (!category) throw new Error("Discount Tidak Ditemukan");

        res.status(200).send({
            message: 'Get Discount By Id',
            data: category,
        })
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const category = await prisma.discount.findUnique({
            where: { id: Number(id) },
        });

        if (!category) throw new Error("Discount Tidak Terdaftar");

        await prisma.discount.delete({
            where: {
                id: Number(id)
            }
        })

        res.status(200).send({
            message: 'Discount berhasil dihapus',
        })
    }
}