import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@/custom";
import { createProduct, deleteProduct, getAllData, getById, updateProduct } from "@/services/product.service";

export class ProductController {

    async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            await createProduct(req);
            
            res.status(200).send({
                message: 'Success Create Product',
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            await updateProduct(req);

            res.status(200).send({
                message: 'Success Create Product',
            });

        } catch (error) {
            next(error);
        }
    }

    async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            interface IFilter {
                search?: string;
                category_id?: number;
                sortBy?: string;
                sortOrder?: string;
                page: number;
            }
        
            const { search, category_id, sortBy, sortOrder, page } = req.query;
        
            const filter: IFilter = {
                search: search ? String(search) : "",
                sortBy: sortBy ? String(sortBy) : "name",
                sortOrder: sortOrder === "desc" ? "desc" : "asc",
                page: parseInt(page as string) || 1,
                category_id: parseInt(category_id as string) || undefined,
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

    async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { id } = req.params;

        await deleteProduct(Number(id));

        res.status(200).send({
            message: 'product berhasil dihapus',
        })
    }
}