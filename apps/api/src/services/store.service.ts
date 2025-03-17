import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createStore = async (req: any) => {
    try {
        const { name, lat, long, description } = req.body;
        const checkExist = await prisma.stores.findUnique({
            where: { name },
        });

        if (checkExist) throw new Error("Toko sudah terdaftar.");

        await prisma.$transaction(async (prisma) => {
            await prisma.stores.create({
                data: {
                    name: name,
                    lat: lat,
                    long: long,
                    description: description,
                    createdBy: req.admin?.id,
                },
            });
        });
    } catch (error: any) {
        throw new Error(error)
    }

}

export const updateStore = async (req: any) => {
    try {
        const { id } = req.params;
        const { name, lat, long, description } = req.body;

        const checkExist = await prisma.stores.findUnique({
            where: { id: Number(id) },
        });

        if (!checkExist) throw new Error("Toko tidak terdaftar.");

        const update = await prisma.stores.update({
            where: { id: Number(id) },
            data: {
                name: name,
                lat: lat,
                long: long,
                description: description,
                updatedBy: req.admin?.id,
                updatedAt: new Date(),
            },
        });
    } catch (error: any) {
        throw new Error(error)
    }

}

export const getAllData = async (filter: any) => {
    const orderBy: Record<string, "asc" | "desc"> = {};
    if (filter.sortBy) {
        orderBy[filter.sortBy] = filter.sortOrder === "desc" ? "desc" : "asc";
    }

    const data = await prisma.stores.findMany({
        select: {
            id: true, name: true, description: true,
        },
        where: {
            OR: [
                { name: { contains: filter.search } },
            ],
            AND: [
                { deletedAt: null }
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
        const store = await prisma.stores.findUnique({
            where: { id: id },
        });

        if (!store) throw new Error("Toko tidak ditemukan.");
        return store;
    } catch (error: any) {
        throw new Error(error)
    }
}

export const deleteStore = async (id: number) => {
    try {
        const store = await prisma.stores.findUnique({
            where: { id: id },
        });

        if (!store) throw new Error("Toko tidak terdaftar.");

        await prisma.stores.update({
            where: { id: id },
            data: { deletedAt: new Date() }
        })
    } catch (error: any) {
        throw new Error(error)
    }
}