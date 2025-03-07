import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createStock = async (req: any) => {
    try {
        const { product_id, store_id, tipe, qty } = req.body;
        const checkExist = await prisma.stock.findFirst({
            where: { product_id: Number(product_id), store_id: Number(store_id) },
        });

        if (tipe === 'OUT') {
            if (!checkExist || checkExist.qty === undefined || checkExist.qty <= 0) {
                throw new Error("Stock Tidak Ada");
            }
        }

        await prisma.$transaction(async (prisma) => {
            if (checkExist) {
                await prisma.jurnalStock.create({
                    data: {
                        stock_id: checkExist.id,
                        type: tipe,
                        qty: qty,
                        status: true,
                        createdBy: req.admin?.id,
                        updatedBy: req.admin?.id,
                    }
                });

                const totalQty = tipe === 'OUT' ? Number(checkExist.qty) - Number(qty) : Number(checkExist.qty) + Number(qty);
                await prisma.stock.update({
                    where: { id: Number(checkExist.id) },
                    data: {
                        qty: totalQty,
                        updatedAt: new Date(),
                        updatedBy: req.admin?.id,
                    }
                });

            } else {
                const newData = await prisma.stock.create({
                    data: {
                        product_id: product_id,
                        store_id: store_id ? Number(store_id) : 0,
                        qty: qty,
                        createdBy: req.admin?.id,
                        updatedBy: req.admin?.id,
                    },
                });

                await prisma.jurnalStock.create({
                    data: {
                        stock_id: newData.id,
                        type: tipe,
                        qty: qty,
                        status: true,
                        createdBy: req.admin?.id,
                        updatedBy: req.admin?.id,
                    }
                });

            }

        });
    } catch (error: any) {
        throw new Error(error)
    }

}

export const updateStock = async (req: any) => {
    try {
        const { id } = req.params;
        const { tipe, qty } = req.body;
        const checkExist = await prisma.stock.findFirst({
            where: { id: Number(id) },
        });

        if (!checkExist) throw new Error("Stock Tidak Ditemukan");

        if (tipe === 'OUT') {
            if (!checkExist || checkExist.qty === undefined || checkExist.qty <= 0) {
                throw new Error("Stock Tidak Ada");
            }
        }

        await prisma.jurnalStock.create({
            data: {
                stock_id: checkExist?.id,
                type: tipe,
                qty: qty,
                status: true,
                createdBy: req.admin?.id,
                updatedBy: req.admin?.id,
            }
        });

        const totalQty = tipe === 'OUT' ? Number(checkExist.qty) - Number(qty) : Number(checkExist.qty) + Number(qty);
        await prisma.stock.update({
            where: { id: Number(checkExist.id) },
            data: {
                qty: totalQty,
                updatedAt: new Date(),
                updatedBy: req.admin?.id,
            }
        });
    } catch (error: any) {
        throw new Error(error)
    }

}

export const getAllData = async (filter: any) => {
    let orderBy: any = {};

    if (filter.sortBy) {
        if (filter.sortBy === "name") {
            orderBy = { products: { name: filter.sortOrder } };
        } else {
            orderBy = { [filter.sortBy]: filter.sortOrder };
        }
    }


    const data = await prisma.stock.findMany({
        select: {
            id: true, products: true, qty: true,
        },
        where: {
            OR: [
                { products: { name: { contains: filter.search } } },
            ],
            AND: [
                { deletedAt: null, store_id: Number(filter.storeId) }
            ],
        },
        orderBy,
        skip: filter.page != 1 ? (filter.page - 1) * 10 : 0,
        take: 10,
    })

    return data;
}

export const getById = async (id: number) => {
    try {

    } catch (error: any) {
        throw new Error(error)
    }
}

export const deleteStock = async (id: number) => {
    try {

    } catch (error: any) {
        throw new Error(error)
    }
}