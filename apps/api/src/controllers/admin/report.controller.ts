import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class ReportController {
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

}