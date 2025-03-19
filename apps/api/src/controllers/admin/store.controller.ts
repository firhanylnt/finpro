import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@/custom";
import { createStore, deleteStore, getAllData, getById, updateStore } from "../services/store.service";

export class StoreController {

    async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            await createStore(req);

            res.status(200).send({
                message: 'Berhasil membuat toko.',
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            await updateStore(req);

            res.status(200).send({
                message: 'Berhasil mengubah toko.',
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
                message: 'Get All store',
                data
            })
        } catch (error) {
            next(error);
        }
    }

    async getById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { id } = req.params;

        const store = await getById(Number(id))
        res.status(200).send({
            message: 'Get Store By Id',
            data: store,
        })
    }

    async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        const { id } = req.params;

        await deleteStore(Number(id));

        res.status(200).send({
            message: 'store berhasil dihapus',
        })
    }
}