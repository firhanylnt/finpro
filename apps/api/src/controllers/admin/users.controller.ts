import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@/custom";
import { PrismaClient } from "@prisma/client";
import { genSalt, hash } from "bcrypt";
const prisma = new PrismaClient();

export class UsersController {
    async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            
            const { fullname, email, password, role_id, store_id, status } = req.body;
            const checkAdmin = await prisma.admins.findUnique({
                where: { email },
            });

            if (checkAdmin) throw new Error("Email sudah terdaftar");

            const roles = await prisma.roles.findUnique({
                where: { id: Number(role_id) },
            });

            if (!roles) throw new Error("Role tidak ada");

            const salt = await genSalt(10);
            const hashPassword = await hash(password, salt);

            await prisma.$transaction(async (prisma) => {
                await prisma.admins.create({
                    data: {
                        fullname: fullname,
                        email: email,
                        password: hashPassword,
                        role_id: roles.id,
                        store_id: store_id ? Number(store_id) : null,
                        status: status === 'true' ? true : false,
                        createdBy: req.admin?.id,
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

    async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { fullname, email, password, role_id, status, store_id } = req.body;

            const checkAdmin = await prisma.admins.findUnique({
                where: { id: Number(id) },
            });

            console.log(checkAdmin)

            if (!checkAdmin) throw new Error("Admin Tidak Temukan");

            const roles = await prisma.roles.findUnique({
                where: { id: role_id },
            });

            if (!roles) throw new Error("Role tidak ada");

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
                    store_id: store_id ? Number(store_id) : null,
                    status: status === 'true' ? true : false,
                    updatedBy: req.admin?.id,
                    updatedAt: new Date(),
                },
            });

            res.status(200).send({
                message: 'Success update Admin',
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
                sortBy: sortBy ? String(sortBy) : "fullname",
                sortOrder: sortOrder === "desc" ? "desc" : "asc",
                page: parseInt(page as string) || 1,
            };
        
            const whereCondition: any = {
                AND: [{ deletedAt: null }],
            };
        
            if (filter.search) {
                whereCondition.OR = [
                    { fullname: { contains: filter.search, mode: "insensitive" } },
                    { email: { contains: filter.search, mode: "insensitive" } },
                    { store: { name: { contains: filter.search, mode: "insensitive" } } },
                    { roles: { name: { contains: filter.search, mode: "insensitive" } } },
                ];
            }

            const orderBy: Record<string, "asc" | "desc"> = {};
            if (filter.sortBy) {
                orderBy[filter.sortBy] = filter.sortOrder === "desc" ? "desc" : "asc";
            }
        
            const data = await prisma.admins.findMany({
                select: {
                    id: true,
                    fullname: true,
                    email: true,
                    status: true,
                    createdAt: true,
                    roles: true,
                    store: true,
                },
                where: whereCondition,
                orderBy,
                skip: (filter.page - 1) * 10,
                take: 10,
            });
        
            res.status(200).send({
                message: "Get All Admin Data",
                data,
            });
        } catch (error) {
            next(error);
        }
        
    }

    async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
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

    async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { id } = req.params;

        const admin = await prisma.admins.findUnique({
            where: { id: Number(id) },
        });

        if (!admin) throw new Error("admin Tidak Terdaftar");

        await prisma.admins.update({
            where: { id: Number(id) },
            data: { deletedAt: new Date() }
        });

        res.status(200).send({
            message: 'Admin berhasil dihapus',
        })
    }
}