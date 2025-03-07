import { PrismaClient } from "@prisma/client";
import { genSalt, hash } from "bcrypt";
const prisma = new PrismaClient();

export const createAdmin = async (req: any) => {
    try {
        const { fullname, email, password, role_id, store_id, status } = req.body;
        const checkAdmin = await prisma.admins.findUnique({
            where: { email },
        });

        if (checkAdmin) throw new Error("Email sudah terdaftar");

        const roles = await prisma.roles.findUnique({
            where: { id: Number(role_id) },
        });

        if (!roles) throw new Error("Role tidak ada");

        const salt = await genSalt(10);
        const hashPassword = await hash(password, salt);

        await prisma.$transaction(async (prisma) => {
            await prisma.admins.create({
                data: {
                    fullname: fullname,
                    email: email,
                    password: hashPassword,
                    role_id: roles.id,
                    store_id: store_id ? Number(store_id) : null,
                    status: status === 'true' ? true : false,
                    createdBy: req.admin?.id,
                },
            });
        });
    } catch (error: any) {
        throw new Error(error)
    }

}

export const updateAdmin = async (req: any) => {
    try {
        const { id } = req.params;
        const { fullname, email, password, role_id, status, store_id } = req.body;

        const checkAdmin = await prisma.admins.findUnique({
            where: { id: Number(id) },
        });

        if (!checkAdmin) throw new Error("Admin Tidak Temukan");

        const roles = await prisma.roles.findUnique({
            where: { id: role_id },
        });

        if (!roles) throw new Error("Role tidak ada");

        let hashPassword = checkAdmin.password;
        if (password !== '') {
            const salt = await genSalt(10);
            hashPassword = await hash(password, salt);
        }

        const update = await prisma.admins.update({
            where: { id: Number(id) },
            data: {
                fullname: fullname,
                email: email,
                password: hashPassword,
                role_id: roles.id,
                store_id: store_id ? Number(store_id) : null,
                status: status === 'true' ? true : false,
                updatedBy: req.admin?.id,
                updatedAt: new Date(),
            },
        });
    } catch (error: any) {
        throw new Error(error)
    }

}

export const getAllData = async (filter: any) => {
    const whereCondition: any = {
        AND: [{ deletedAt: null }],
    };

    if (filter.search) {
        whereCondition.OR = [
            { fullname: { contains: filter.search, mode: "insensitive" } },
            { email: { contains: filter.search, mode: "insensitive" } },
            { store: { name: { contains: filter.search, mode: "insensitive" } } },
            { roles: { name: { contains: filter.search, mode: "insensitive" } } },
        ];
    }

    if (filter.role_id) {
        whereCondition.AND.push({ role_id: filter.role_id });
    }

    if (filter.store_id) {
        whereCondition.AND.push({ store_id: filter.store_id });
    }

    const orderBy: Record<string, "asc" | "desc"> = {};
    if (filter.sortBy) {
        orderBy[filter.sortBy] = filter.sortOrder === "desc" ? "desc" : "asc";
    }

    const data = await prisma.admins.findMany({
        select: {
            id: true,
            fullname: true,
            email: true,
            status: true,
            createdAt: true,
            roles: true,
            store: true,
        },
        where: whereCondition,
        orderBy,
        skip: (filter.page - 1) * 10,
        take: 10,
    });

    return data;
}

export const getAllDataEndUser = async (filter: any) => {
    const whereCondition: any = {
        AND: [{ deletedAt: null }],
    };

    if (filter.search) {
        whereCondition.OR = [
            { fullname: { contains: filter.search, mode: "insensitive" } },
            { email: { contains: filter.search, mode: "insensitive" } },
            { phone_number: { contains: filter.search, mode: "insensitive" } },
        ];
    }

    if (filter.status) {
        whereCondition.AND.push({ status: filter.status === 'true' ? true : false });
    }

    const orderBy: Record<string, "asc" | "desc"> = {};
    if (filter.sortBy) {
        orderBy[filter.sortBy] = filter.sortOrder === "desc" ? "desc" : "asc";
    }

    const data = await prisma.users.findMany({
        select: {
            id: true,
            fullname: true,
            email: true,
            phone_number: true,
            status: true,
            createdAt: true,
        },
        where: whereCondition,
        orderBy,
        skip: (filter.page - 1) * 10,
        take: 10,
    });

    return data;
}

export const getById = async (id: number) => {
    try {
        const admin = await prisma.admins.findUnique({
            where: { id: Number(id) },
        });

        if (!admin) throw new Error("admin Tidak Terdaftar");
        return admin;
    } catch (error: any) {
        throw new Error(error)
    }
}

export const deleteAdmin = async (id: number) => {
    try {
        const admin = await prisma.admins.findUnique({
            where: { id: Number(id) },
        });

        if (!admin) throw new Error("admin Tidak Terdaftar");

        await prisma.admins.update({
            where: { id: Number(id) },
            data: { deletedAt: new Date() }
        });
    } catch (error: any) {
        throw new Error(error)
    }
}