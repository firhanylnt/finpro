import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@/custom";
import { createDiscount, deleteDiscount, getAllData, getById, updateDiscount } from "../../services/discount.service";

export class DiscountController {

    async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const insert = await createDiscount(req);
            res.status(200).send({
                message: 'Success Create Discount',
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            
            const update = await updateDiscount(req);

            res.status(200).send({
                message: 'Success update discount',
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
                store_id?: number;
                discount_type_id?: number;
                sortOrder?: string;
                page: number;
            }
        
            const { search, store_id, discount_type_id, sortBy, sortOrder, page } = req.query;
        
            const filter: IFilter = {
                search: search ? String(search) : "",
                sortBy: sortBy ? String(sortBy) : "name",
                sortOrder: sortOrder === "desc" ? "desc" : "asc",
                page: parseInt(page as string) || 1,
                store_id: parseInt(store_id as string) || undefined,
                discount_type_id: parseInt(discount_type_id as string) || undefined,
            };
        
            const data = await getAllData(filter);

            res.status(200).send({
                message: 'Get All Discount',
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
            message: 'Get Discount By Id',
            data: category,
        })
    }

    async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { id } = req.params;

        const del = await deleteDiscount(Number(id));

        res.status(200).send({
            message: 'Discount berhasil dihapus',
        })
    }
}