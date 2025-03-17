import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


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

    if (filter.categoryId) {
        whereCondition.AND.push({ product_category_id: filter.categoryId });
    }

    if (filter.storeId) {
        whereCondition.AND.push({ stock: { some: { store_id: filter.storeId } } });
    }

    const orderBy: Record<string, "asc" | "desc"> = {};
    if (filter.sortBy) {
        if (filter.sortBy === 'lowest_price') {
            orderBy['price'] = "asc";
        } else if (filter.sortBy === 'highest_price') {
            orderBy['price'] = "desc";
        } else if (filter.sortBy === 'a_to_z') {
            orderBy['name'] = "asc";
        } else if (filter.sortBy === 'z_to_a') {
            orderBy['name'] = "desc";
        }
    }

    const data = await prisma.products.findMany({
        select: {
            id: true, name: true, price: true, description: true, status: true, createdAt: true,
            productcategory: true,
            productimages: true,
            stock: {
                select: {
                    id: true,
                    qty: true,
                    store_id: true,
                },
                where: { store_id: filter.storeId },
            },
            
            productdiscount: {
                select: {
                    discount: true
                },
                where: {discount: { store_id: filter.storeId}}
            }
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
        const product = await prisma.stock.findUnique({
            select: {
                id: true,
                qty: true,
                store_id: true,
                products: {
                    select: {
                        id: true, name: true, price: true, description: true, status: true, createdAt: true,
                        productcategory: true,
                        productimages: true,
                        productdiscount: { select: { discount: true } }
                    }
                }
            },
            where: { id: id },
        });

        if (!product) throw new Error("Product Tidak Ditemukan");
        return product;
    } catch (error: any) {
        throw new Error(error)
    }
}