import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@/custom";
import { getAllData, getById } from "@/services/productSearch.service";

export class ProductSearchController {

    async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            interface IFilter {
                search?: string;
                categoryId?: number;
                storeId?: number;
                minPrice?: number;
                maxPrice?: number;
                sortBy?: string;
                page: number;
            }
        
            const { storeId, search, categoryId, minPrice, maxPrice, sortBy, page } = req.query;
        
            const filter: IFilter = {
                search: search ? String(search) : "",
                storeId: parseInt(storeId as string) || undefined,
                categoryId: parseInt(categoryId as string) || undefined,
                minPrice: parseInt(minPrice as string) || undefined,
                maxPrice: parseInt(maxPrice as string) || undefined,
                sortBy: sortBy ? String(sortBy) : "",
                page: parseInt(page as string) || 1,
                
            };

            const data = await getAllData(filter);

            res.status(200).send({
                message: 'Get All Product',
                data
            })
        } catch (error) {
            next(error);
        }
    }

    async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { id } = req.params;

        const product = await getById(Number(id));

        res.status(200).send({
            message: 'Get product By Id',
            data: product,
        })
    }

}