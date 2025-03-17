import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllData = async (filter: any) => {
    const queryParams: any[] = [];
    let query = `
        SELECT 
            TO_CHAR(t."createdAt", 'YYYY-MM') AS month,
            COUNT(t.id)::BIGINT AS total
        FROM public."Transactions" t
        JOIN public."TransactionsDetails" td ON t.id = td.transaction_id
        JOIN public."Products" p ON p.id = td.product_id
        WHERE t."deletedAt" IS NULL AND t.status = 1
    `;

    if (filter.startMonth && filter.endMonth) {
        query += ` AND TO_CHAR(t."createdAt", 'YYYY-MM') BETWEEN $${queryParams.length + 1} AND $${queryParams.length + 2}`;
        queryParams.push(filter.startMonth, filter.endMonth);
    } else if (filter.startMonth) {
        query += ` AND TO_CHAR(t."createdAt", 'YYYY-MM') >= $${queryParams.length + 1}`;
        queryParams.push(filter.startMonth);
    } else if (filter.endMonth) {
        query += ` AND TO_CHAR(t."createdAt", 'YYYY-MM') <= $${queryParams.length + 1}`;
        queryParams.push(filter.endMonth);
    }

    if (filter.storeId) {
        query += ` AND t.store_id = $${queryParams.length + 1}`;
        queryParams.push(filter.storeId);
    }

    if (filter.categoryId) {
        query += ` AND p.product_category_id = $${queryParams.length + 1}`;
        queryParams.push(filter.categoryId);
    }

    if (filter.productId) {
        query += ` AND td.product_id = $${queryParams.length + 1}`;
        queryParams.push(filter.productId);
    }

    query += ` GROUP BY month ORDER BY month;`;

    const allData: { month: string; total: bigint }[] = await prisma.$queryRawUnsafe(query, ...queryParams);

    return allData.map((row) => ({
        month: row.month,
        total: Number(row.total),
    }));
};

export const perProduct = async(filter: any) => {
    const queryParams: any[] = [];
    let query = `
        SELECT
            p.name,
            COUNT(t.id)::BIGINT AS total
        From public."Products" p
        JOIN public."TransactionsDetails" td ON p.id = td.product_id
        JOIN public."Transactions" t ON t.id = td.transaction_id
        WHERE t."deletedAt" IS NULL AND t.status = 1
    `;

    if (filter.startMonth && filter.endMonth) {
        query += ` AND TO_CHAR(t."createdAt", 'YYYY-MM') BETWEEN $${queryParams.length + 1} AND $${queryParams.length + 2}`;
        queryParams.push(filter.startMonth, filter.endMonth);
    } else if (filter.startMonth) {
        query += ` AND TO_CHAR(t."createdAt", 'YYYY-MM') >= $${queryParams.length + 1}`;
        queryParams.push(filter.startMonth);
    } else if (filter.endMonth) {
        query += ` AND TO_CHAR(t."createdAt", 'YYYY-MM') <= $${queryParams.length + 1}`;
        queryParams.push(filter.endMonth);
    }

    if (filter.storeId) {
        query += ` AND t.store_id = $${queryParams.length + 1}`;
        queryParams.push(filter.storeId);
    }

    if (filter.categoryId) {
        query += ` AND p.product_category_id = $${queryParams.length + 1}`;
        queryParams.push(filter.categoryId);
    }

    if (filter.productId) {
        query += ` AND td.product_id = $${queryParams.length + 1}`;
        queryParams.push(filter.productId);
    }

    query += ` GROUP BY p.name ORDER BY total;`;

    const allData: { name: string; total: bigint }[] = await prisma.$queryRawUnsafe(query, ...queryParams);

    return allData.map((row) => ({
        name: row.name,
        total: Number(row.total),
    }));
}

export const perCategory = async(filter: any) => {
    const queryParams: any[] = [];
    let query = `
        SELECT
            pc.name,
            COUNT(t.id)::BIGINT AS total
        From public."ProductCategory" pc
        JOIN public."Products" p on p.product_category_id = pc.id
        JOIN public."TransactionsDetails" td ON p.id = td.product_id
        JOIN public."Transactions" t ON t.id = td.transaction_id
        WHERE t."deletedAt" IS NULL AND t.status = 1
    `;

    if (filter.startMonth && filter.endMonth) {
        query += ` AND TO_CHAR(t."createdAt", 'YYYY-MM') BETWEEN $${queryParams.length + 1} AND $${queryParams.length + 2}`;
        queryParams.push(filter.startMonth, filter.endMonth);
    } else if (filter.startMonth) {
        query += ` AND TO_CHAR(t."createdAt", 'YYYY-MM') >= $${queryParams.length + 1}`;
        queryParams.push(filter.startMonth);
    } else if (filter.endMonth) {
        query += ` AND TO_CHAR(t."createdAt", 'YYYY-MM') <= $${queryParams.length + 1}`;
        queryParams.push(filter.endMonth);
    }

    if (filter.storeId) {
        query += ` AND t.store_id = $${queryParams.length + 1}`;
        queryParams.push(filter.storeId);
    }

    if (filter.categoryId) {
        query += ` AND p.product_category_id = $${queryParams.length + 1}`;
        queryParams.push(filter.categoryId);
    }

    if (filter.productId) {
        query += ` AND td.product_id = $${queryParams.length + 1}`;
        queryParams.push(filter.productId);
    }

    query += ` GROUP BY pc.name ORDER BY total;`;

    const allData: { name: string; total: bigint }[] = await prisma.$queryRawUnsafe(query, ...queryParams);

    return allData.map((row) => ({
        name: row.name,
        total: Number(row.total),
    }));
}
