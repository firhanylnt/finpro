import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "@/custom";
const prisma = new PrismaClient();

export class StockController {

    async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const { product_id, store_id, type, qty } = req.body;
            const checkExist = await prisma.stock.findFirst({
                where: { product_id: Number(product_id), store_id: Number(store_id) },
            });

            if (type === 'OUT') {
                if (!checkExist || checkExist.qty === undefined || checkExist.qty <= 0) {
                    throw new Error("Stock Tidak Ada");
                }
            }

            await prisma.$transaction(async (prisma) => {
                if(checkExist) {
                    await prisma.jurnalStock.create({
                        data: {
                            stock_id: checkExist.id,
                            type: type,
                            qty: qty,
                            status: true,
                            createdBy: req.admin?.id,
                            updatedBy: req.admin?.id,
                        }
                    });

                    const totalQty = type === 'OUT' ? Number(checkExist.qty) - Number(qty) : Number(checkExist.qty) + Number(qty);
                    await prisma.stock.update({
                        where: {id: Number(checkExist.id)},
                        data: {
                            qty: totalQty,
                        }
                    });

                }else{
                    const newData = await prisma.stock.create({
                        data: {
                            product_id: product_id,
                            store_id: store_id,
                            qty: qty,
                            createdBy: req.admin?.id,
                            updatedBy: req.admin?.id,
                        },
                    });

                    await prisma.jurnalStock.create({
                        data: {
                            stock_id: newData.id,
                            type: type,
                            qty: qty,
                            status: true,
                            createdBy: req.admin?.id,
                            updatedBy: req.admin?.id,
                        }
                    });

                }

            });

            res.status(200).send({
                message: 'Success Create Stock',
            });
        } catch (error) {
            next(error);
        }
    }

    async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { product_id, store_id, type, qty } = req.body;
            const checkExist = await prisma.stock.findFirst({
                where: { id: Number(id) },
            });

            if(!checkExist) throw new Error("Stock Tidak Ditemukan");

            if (type === 'OUT') {
                if (!checkExist || checkExist.qty === undefined || checkExist.qty <= 0) {
                    throw new Error("Stock Tidak Ada");
                }
            }

            await prisma.jurnalStock.create({
                data: {
                    stock_id: checkExist?.id,
                    type: type,
                    qty: qty,
                    status: true,
                    createdBy: req.admin?.id,
                    updatedBy: req.admin?.id,
                }
            });

            const totalQty = type === 'OUT' ? Number(checkExist.qty) - Number(qty) : Number(checkExist.qty) + Number(qty);
            await prisma.stock.update({
                where: {id: Number(checkExist.id)},
                data: {
                    qty: totalQty,
                }
            });

        } catch (error) {
            next(error);
        }
    }

}