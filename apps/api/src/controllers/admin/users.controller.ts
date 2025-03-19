import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@/custom";
import { PrismaClient } from "@prisma/client";
import { createAdmin, deleteAdmin, getAllData, getAllDataEndUser, getById, updateAdmin } from "../services/admin.service";

const prisma = new PrismaClient();

export class UsersController {
    async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            await createAdmin(req);
            res.status(200).send({
                message: 'Success Create Admin',
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            await updateAdmin(req);

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
                role_id?: number;
                store_id?: number;
                sortBy?: string;
                sortOrder?: string;
                page: number;
            }
        
            const { search, role_id, store_id, sortBy, sortOrder, page } = req.query;
        
            const filter: IFilter = {
                search: search ? String(search) : "",
                sortBy: sortBy ? String(sortBy) : "fullname",
                sortOrder: sortOrder === "desc" ? "desc" : "asc",
                page: parseInt(page as string) || 1,
                role_id: parseInt(role_id as string) || undefined,
                store_id: parseInt(store_id as string) || undefined,
            };
        
            const data = await getAllData(filter);
        
            res.status(200).send({
                message: "Get All Admin Data",
                data,
            });
        } catch (error) {
            next(error);
        }
        
    }

    async getAllEndUsers(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            interface IFilter {
                search?: string;
                status?: string;
                sortBy?: string;
                sortOrder?: string;
                page: number;
            }
        
            const { search, status, sortBy, sortOrder, page } = req.query;
        
            const filter: IFilter = {
                search: search ? String(search) : "",
                sortBy: sortBy ? String(sortBy) : "fullname",
                sortOrder: sortOrder === "desc" ? "desc" : "asc",
                page: parseInt(page as string) || 1,
                status: status ? String(status) : undefined,
            };

            const data = await getAllDataEndUser(filter);
        
            res.status(200).send({
                message: "Get All Users Data",
                data,
            });
        } catch (error) {
            next(error);
        }
        
    }

    async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { id } = req.params;

        const admin = await getById(Number(id));

        res.status(200).send({
            message: 'Get Admin By Id',
            data: admin,
        })
    }

    async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { id } = req.params;

        await deleteAdmin(Number(id));

        res.status(200).send({
            message: 'Admin berhasil dihapus',
        })
    }
}