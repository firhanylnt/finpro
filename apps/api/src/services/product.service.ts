import { PrismaClient } from "@prisma/client";
import cloudinary from "../cloudinary";
const prisma = new PrismaClient();

export const createProduct = async (req: any) => {
    try {
        const { name, product_category_id, description, price, status } = req.body;

        const checkExist = await prisma.products.findUnique({
            where: { name: String(name) },
        });

        if (checkExist) throw new Error("Product sudah terdaftar");

        await prisma.$transaction(async (prisma) => {
            const product = await prisma.products.create({
                data: {
                    name: name,
                    product_category_id: Number(product_category_id),
                    description: description,
                    price: price,
                    status: status === 'true' ? true : false,
                    createdBy: req.admin?.id,
                    updatedBy: req.admin?.id,
                },
            });
            const files = req.files as Express.Multer.File[];
            await Promise.all(
                files.map(async (file) => {
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: 'products',
                    });
                    return prisma.productImages.create({
                        data: {
                            product_id: product.id,
                            image_name: file.filename,
                            image_url: result.secure_url,
                        },
                    });
                })
            );
        });
    } catch (error: any) {
        throw new Error(error)
    }

}

export const updateProduct = async (req: any) => {
    try {
        const { id } = req.params;
        const { name, product_category_id, description, price, status } = req.body;

        await prisma.$transaction(async (prisma) => {
            const product = await prisma.products.update({
                where: { id: Number(id) },
                data: {
                    name: name,
                    product_category_id: Number(product_category_id),
                    description: description,
                    price: price,
                    status: status === 'true' ? true : false,
                    updatedBy: req.admin?.id,
                    updatedAt: new Date(),
                },
            });
            const files = req.files as Express.Multer.File[];
            const imageUploads = await Promise.all(
                files.map(async (file) => {
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: 'products',
                    });
                    return prisma.productImages.create({
                        data: {
                            product_id: Number(id),
                            image_name: file.filename,
                            image_url: result.secure_url,
                        },
                    });
                })
            );
        });
    } catch (error: any) {
        throw new Error(error)
    }

}

export const getAllData = async (filter: any) => {
    const whereCondition: any = {
        AND: [
            { deletedAt: null },
        ],
    };

    if (filter.search) {
        whereCondition.OR = [
            { name: { contains: filter.search, mode: "insensitive" } },
            { productcategory: { name: { contains: filter.search, mode: "insensitive" } } }
        ];
    }

    if (filter.category_id) {
        whereCondition.AND.push({ product_category_id: filter.category_id });
    }

    const orderBy: Record<string, "asc" | "desc"> = {};
    if (filter.sortBy) {
        orderBy[filter.sortBy] = filter.sortOrder === "desc" ? "desc" : "asc";
    }

    const data = await prisma.products.findMany({
        select: {
            id: true, name: true, price: true, description: true, status: true, createdAt: true,
            productcategory: true,
            productimages: true,
        },
        where: whereCondition,
        orderBy,
        skip: filter.page != 1 ? (filter.page - 1) * 10 : 0,
        take: 10,
    });
    return data;
}

export const getById = async (id: number) => {
    try {
        const product = await prisma.products.findUnique({
            select: {
                id: true, name: true, price: true, description: true, status: true, productimages: true, product_category_id: true,
            },
            where: { id: id },
        });

        if (!product) throw new Error("Product Tidak Ditemukan");
        return product;
    } catch (error: any) {
        throw new Error(error)
    }
}

export const deleteProduct = async (id: number) => {
    try {
        const product = await prisma.products.findUnique({
            where: { id: Number(id) },
        });

        if (!product) throw new Error("product Tidak Terdaftar");

        await prisma.products.update({
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