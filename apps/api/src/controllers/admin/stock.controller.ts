import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@/custom";
import { createStock, getAllData, updateStock } from "../../services/stock.service";

export class StockController {

    async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            await createStock(req);

            res.status(200).send({
                message: 'Success Create Stock',
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            await updateStock(req);
            
            res.status(200).send({
                message: 'Success update stock',
            });

        } catch (error) {
            next(error);
        }
    }

    async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
            try {
                interface IFilter {
                    storeId: number,
                    search?: string;
                    sortBy?: string;
                    sortOrder?: string;
                    page: number;
                }
            
                const { storeId, search, sortBy, sortOrder, page } = req.query;
            
                const filter: IFilter = {
                    storeId: parseInt(storeId as string) || 0,
                    search: search ? String(search) : "",
                    sortBy: sortBy ? String(sortBy) : "name",
                    sortOrder: sortOrder === "desc" ? "desc" : "asc",
                    page: parseInt(page as string) || 1,
                };
    
                const data = await getAllData(filter);
    
                res.status(200).send({
                    message: 'Get All Category',
                    data
                })
            } catch (error) {
                next(error);
            }
        }

}