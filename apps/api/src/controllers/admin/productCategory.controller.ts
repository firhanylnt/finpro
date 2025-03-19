import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@/custom";
import { createCategory, deleteCategory, getAllData, getById, updateCategory } from "../services/categories.service";

export class ProductCategoryController {

    async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            
            await createCategory(req);

            res.status(200).send({
                message: 'Success Create Category',
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            await updateCategory(req);

            res.status(200).send({
                message: 'Success update Category',
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

            const data = await getAllData(filter);

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

        const category = await getById(Number(id));

        res.status(200).send({
            message: 'Get Category By Id',
            data: category,
        })
    }

    async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { id } = req.params;

        await deleteCategory(Number(id));

        res.status(200).send({
            message: 'Category berhasil dihapus',
        })
    }
}