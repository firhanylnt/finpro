import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createCategory = async (req: any) => {
    try {
        const { name, description } = req.body;
        const checkExist = await prisma.productCategory.findUnique({
            where: { name },
        });

        if (checkExist) throw new Error("Category sudah terdaftar");

        await prisma.$transaction(async (prisma) => {
            await prisma.productCategory.create({
                data: {
                    name: name,
                    description: description,
                    createdBy: req.admin?.id,
                },
            });
        });
    } catch (error: any) {
        throw new Error(error)
    }

}

export const updateCategory = async (req: any) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        
        const checkExist = await prisma.productCategory.findUnique({
            where: { id: Number(id) },
        });

        if (!checkExist) throw new Error("Category Tidak Terdaftar");

        const update = await prisma.productCategory.update({
            where: { id: Number(id) },
            data: {
                name: name,
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

    const data = await prisma.productCategory.findMany({
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
        const category = await prisma.productCategory.findUnique({
            where: { id: id },
        });

        if (!category) throw new Error("Category Tidak Ditemukan");
        return category;
    } catch (error: any) {
        throw new Error(error)
    }
}

export const deleteCategory = async (id: number) => {
    try {
        const category = await prisma.productCategory.findUnique({
            where: { id: Number(id) },
        });

        if (!category) throw new Error("category Tidak Terdaftar");

        await prisma.productCategory.update({
            where: {
                id: Number(id)
            },
            data: {
                deletedAt: new Date()
            }
        })
    } catch (error: any) {
        throw new Error(error)
    }
}