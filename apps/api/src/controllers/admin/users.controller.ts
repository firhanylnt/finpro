import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { genSalt, hash, compare } from "bcrypt";
const prisma = new PrismaClient();

export class UsersController {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const { fullname, email, password, role_id, store_id, status, created_by } = req.body;
            const checkAdmin = await prisma.admins.findUnique({
                where: { email },
            });

            if (checkAdmin) throw new Error("Email sudah terdaftar");

            const roles = await prisma.roles.findUnique({
                where: { id: role_id },
            });

            if (!roles) throw new Error("Role tidak ada");

            const store = await prisma.stores.findUnique({
                where: { id: store_id },
            });

            if (!store) throw new Error("Store tidak ada");

            const salt = await genSalt(10);
            const hashPassword = await hash(password, salt);

            await prisma.$transaction(async (prisma) => {
                await prisma.admins.create({
                    data: {
                        fullname: fullname,
                        email: email,
                        password: hashPassword,
                        role_id: roles.id,
                        store_id: store.id,
                        status: status,
                        createdBy: created_by,
                    },
                });
            });

            res.status(200).send({
                message: 'Success Create Admin',
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { fullname, email, password, role_id, status, store_id, updated_by } = req.body;

            const checkAdmin = await prisma.admins.findUnique({
                where: { id: Number(id) },
            });

            if (!checkAdmin) throw new Error("Admin Tidak Temukan");

            const roles = await prisma.roles.findUnique({
                where: { id: role_id },
            });

            if (!roles) throw new Error("Role tidak ada");

            const store = await prisma.stores.findUnique({
                where: { id: store_id },
            });

            if (!store) throw new Error("Store tidak ada");

            let hashPassword = checkAdmin.password;
            if (password !== '') {
                const salt = await genSalt(10);
                hashPassword = await hash(password, salt);
            }

            const update = await prisma.admins.update({
                where: { id: Number(id) },
                data: {
                    fullname: fullname,
                    email: email,
                    password: hashPassword,
                    role_id: roles.id,
                    store_id: store.id,
                    status: status,
                    updatedBy: updated_by,
                    updatedAt: new Date(),
                },
            })

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

            const whereCondition: any = {
                AND: [{ deletedAt: null }],
            };

            if (filter.keyword) {
                whereCondition.OR = [
                    { fullname: { contains: filter.keyword } },
                    { email: { contains: filter.keyword } },
                    { store: { name: { contains: filter.keyword } } },
                    { roles: { name: { contains: filter.keyword } } },
                ];
            }

            const data = await prisma.admins.findMany({
                select: {
                    fullname: true, email: true, status: true,
                    roles: true,
                    store: true,
                },
                where: whereCondition,
                skip: filter.page != 1 ? (filter.page - 1) * filter.pageSize : 0,
                take: filter.pageSize,
            })

            res.status(200).send({
                message: 'Get All Admin Data',
                data
            })
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const admin = await prisma.admins.findUnique({
            where: { id: Number(id) },
        });

        if (!admin) throw new Error("admin Tidak Terdaftar");

        res.status(200).send({
            message: 'Get Admin By Id',
            data: admin,
        })
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        const admin = await prisma.admins.findUnique({
            where: { id: Number(id) },
        });

        if (!admin) throw new Error("admin Tidak Terdaftar");

        await prisma.admins.delete({
            where: {
                id: Number(id)
            }
        })

        res.status(200).send({
            message: 'Admin berhasil dihapus',
        })
    }
}