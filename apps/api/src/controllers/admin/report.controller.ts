import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@/custom";
import { PrismaClient } from "@prisma/client";
import { getAllData, perCategory, perProduct } from "@/services/report.service";
import { jurnalStock } from "@/services/reportStock.service";
const prisma = new PrismaClient();

export class ReportController {
    async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            interface IFilter {
                startMonth?: string;
                endMonth?: string;
                storeId?: number;
                productId?: number;
                categoryId?: number;
            }

            const { startMonth, endMonth, storeId, productId, categoryId } = req.query;

            const filter: IFilter = {
                startMonth: startMonth ? String(startMonth) : "",
                endMonth: endMonth ? String(endMonth) : "",
                storeId: parseInt(storeId as string) || undefined,
                productId: parseInt(productId as string) || undefined,
                categoryId: parseInt(categoryId as string) || undefined,
            };

            const all = await getAllData(filter);
            const product = await perProduct(filter);
            const category = await perCategory(filter);

            res.status(200).send({
                message: 'Get All Report',
                data : {
                    all,
                    product,
                    category
                }
            })
        } catch (error) {
            next(error);
        }
    }

    async getStock(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            interface IFilter {
                startMonth?: string;
                endMonth?: string;
                storeId?: number;
            }

            const { startMonth, endMonth, storeId, productId, categoryId } = req.query;

            const filter: IFilter = {
                startMonth: startMonth ? String(startMonth) : "",
                endMonth: endMonth ? String(endMonth) : "",
                storeId: parseInt(storeId as string) || undefined,
            };

            const data = await jurnalStock(filter);

            res.status(200).send({
                message: 'Get All Report',
                data
            })
        } catch (error) {
            next(error);
        }
    }

}