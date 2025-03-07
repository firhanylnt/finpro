import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createDiscount = async (req: any) => {
    try {
        const { name, discount_type_id, product_id, store_id, coupon, amount, min_purchase, max_discount, start_date, end_date, status } = req.body;
        await prisma.$transaction(async (prisma) => {
            const discount = await prisma.discount.create({
                data: {
                    name: name,
                    coupon: coupon !== '' ? coupon : null,
                    discount_type_id: Number(discount_type_id),
                    store_id: store_id !== '' ? Number(store_id) : null,
                    amount: amount !== 0 ? amount : null,
                    min_purchase: min_purchase !== 0 ? min_purchase : null,
                    max_discount: max_discount !== 0 ? max_discount : null,
                    start_date: new Date(start_date),
                    end_date: new Date(end_date),
                    status: status === 'true' ? true : false,
                    createdBy: req.admin?.id,
                },
            });
            if (discount) {
                if (product_id !== '') {
                    await prisma.productDiscount.create({
                        data: {
                            discount_id: discount.id,
                            product_id: product_id,
                        }
                    });
                }
            }
        });
    } catch (error: any) {
        throw new Error(error)
    }
}

export const updateDiscount = async (req: any) => {
    const { id } = req.params;
    const { name, discount_type_id, coupon, product_id, store_id, amount, min_purchase, max_discount, start_date, end_date, status } = req.body;

    const checkExist = await prisma.discount.findUnique({
        where: { id: Number(id) },
    });

    if (!checkExist) throw new Error("Discount Tidak Terdaftar");

    await prisma.$transaction(async (prisma) => {
        await prisma.discount.update({
            where: { id: Number(id) },
            data: {
                name: name,
                coupon: coupon !== '' ? coupon : null,
                discount_type_id: Number(discount_type_id),
                store_id: store_id !== '' ? Number(store_id) : null,
                amount: amount !== 0 ? amount : null,
                min_purchase: min_purchase !== 0 ? min_purchase : null,
                max_discount: max_discount !== 0 ? max_discount : null,
                start_date: new Date(start_date),
                end_date: new Date(end_date),
                status: status === 'true' ? true : false,
                updatedBy: req.admin?.id,
                updatedAt: new Date(),
            },
        });

        const productDiscount = await prisma.productDiscount.findFirstOrThrow({
            where: { discount_id: Number(id) }
        });

        if (productDiscount) {
            await prisma.productDiscount.update({
                where: { id: productDiscount.id },
                data: {
                    product_id: product_id
                }
            })
        } else {
            if (product_id !== null) {
                await prisma.productDiscount.create({
                    data: {
                        discount_id: Number(id),
                        product_id: product_id,
                    }
                });
            }
        }
    });
}

export const getAllData = async (filter: any) => {
    const whereCondition: any = {
        AND: [{ deletedAt: null }],
    };

    if (filter.store_id) {
        whereCondition.AND.push({ store_id: filter.store_id });
    }

    if (filter.discount_type_id) {
        whereCondition.AND.push({ discount_type_id: filter.discount_type_id });
    }

    if (filter.search) {
        whereCondition.OR = [
            { name: { contains: filter.search, mode: "insensitive" } },
            { coupon: { contains: filter.search, mode: "insensitive" } },
            { discountype: { name: { contains: filter.search, mode: "insensitive" } } },
            { productdiscount: { products: { name: { contains: filter.search, mode: "insensitive" } } } },
            { price: { contains: filter.search, mode: "insensitive" } },
        ];
    }

    const orderBy: Record<string, "asc" | "desc"> = {};
    if (filter.sortBy) {
        orderBy[filter.sortBy] = filter.sortOrder === "desc" ? "desc" : "asc";
    }

    const data = await prisma.discount.findMany({
        select: {
            id: true,
            name: true,
            coupon: true,
            amount: true,
            min_purchase: true,
            max_discount: true,
            status: true,
            start_date: true,
            end_date: true,
            discounttype: { select: { name: true } },
            productdiscount: { select: { products: { select: { name: true } } } },
            stores: true,
        },
        where: whereCondition,
        orderBy,
        skip: filter.page != 1 ? (filter.page - 1) * 10 : 0,
        take: 10,
    })

    return data;
}

export const getById = async(id: number) => {
    const category = await prisma.discount.findUnique({
        where: { id: id },
        select: {
            id: true,
            name: true,
            coupon: true,
            amount: true,
            min_purchase: true,
            max_discount: true,
            status: true,
            start_date: true,
            end_date: true,
            discount_type_id: true,
            store_id: true,
            productdiscount: { select: { products: { select: { id: true } } } },
        }
    });

    if (!category) throw new Error("Discount Tidak Ditemukan");
    return category;
}

export const deleteDiscount = async(id: number) => {
    const category = await prisma.discount.findUnique({
        where: { id: id },
    });

    if (!category) throw new Error("Discount Tidak Terdaftar");

    await prisma.discount.update({
        where: {
            id: Number(id)
        },
        data: {
            deletedAt: new Date(),
        }
    })
}