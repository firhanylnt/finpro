import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const jurnalStock = async (filter: any) => {
    const queryParams: any[] = [];
    let query = `
    SELECT
        p.id,
        p.name,
        st.name as store_name,
        COALESCE(SUM(CASE WHEN js.type = 'IN' THEN js.qty ELSE 0 END), 0) AS total_in,
        COALESCE(SUM(CASE WHEN js.type = 'OUT' THEN js.qty ELSE 0 END), 0) AS total_out,
        COALESCE(SUM(CASE WHEN js.type = 'IN' THEN js.qty ELSE 0 END), 0) - 
        COALESCE(SUM(CASE WHEN js.type = 'OUT' THEN js.qty ELSE 0 END), 0) AS total_stock
    FROM public."Products" p
    JOIN public."Stock" s ON s.product_id = p.id
    JOIN public."JurnalStock" js ON js.stock_id = s.id
    JOIN public."Stores" st ON st.id = s.store_id
    WHERE s."deletedAt" IS NULL
`;

if (filter.storeId) {
    queryParams.push(parseInt(filter.storeId, 10));
    query += ` AND st.id = $${queryParams.length}`;
}

if (filter.search) {
    queryParams.push(`%${filter.search}%`);
    query += ` AND p.name ILIKE $${queryParams.length}`;
}

if (filter.startMonth && filter.endMonth) {
    query += ` AND TO_CHAR(js."createdAt", 'YYYY-MM') BETWEEN $${queryParams.length + 1} AND $${queryParams.length + 2}`;
    queryParams.push(filter.startMonth, filter.endMonth);
} else if (filter.startMonth) {
    query += ` AND TO_CHAR(js."createdAt", 'YYYY-MM') >= $${queryParams.length + 1}`;
    queryParams.push(filter.startMonth);
} else if (filter.endMonth) {
    query += ` AND TO_CHAR(js."createdAt", 'YYYY-MM') <= $${queryParams.length + 1}`;
    queryParams.push(filter.endMonth);
}

query += ` GROUP BY p.id, p.name, st.name, s.id ORDER BY p.name`;

const allData: { id: number, name: string; store_name: string, total_in: bigint, total_out: bigint, total_stock: bigint }[] = await prisma.$queryRawUnsafe(query, ...queryParams);

return allData.map((row) => ({
    id: row.id,
    name: row.name,
    store_name: row.store_name,
    total_in: Number(row.total_in),
    total_out: Number(row.total_out),
    total: Number(row.total_stock),
}));


}

export const detailJurnal = async (id: number, filter: any) => {
    const queryParams: any[] = [id];
    let query = `
        SELECT p.name, js.qty, js.type, TO_CHAR(js."createdAt", 'FMDD FMMonth YYYY') as date
        FROM public."JurnalStock" js
        JOIN public."Stock" s ON js.stock_id = s.id
        JOIN public."Products" p ON p.id = s.product_id
        JOIN public."Stores" st ON st.id = s.store_id
        WHERE p.id = $1
    `;

    if (filter.storeId) {
        queryParams.push(filter.storeId);
        query += `AND s.store_id = $${queryParams.length}`;
    }

    if (filter.startMonth && filter.endMonth) {
        queryParams.push(filter.startMonth, filter.endMonth);
        query += ` AND TO_CHAR(js."createdAt", 'YYYY-MM') BETWEEN $${queryParams.length - 1} AND $${queryParams.length}`;
    } else if (filter.startMonth) {
        queryParams.push(filter.startMonth);
        query += ` AND TO_CHAR(js."createdAt", 'YYYY-MM') >= $${queryParams.length}`;
    } else if (filter.endMonth) {
        queryParams.push(filter.endMonth);
        query += ` AND TO_CHAR(js."createdAt", 'YYYY-MM') <= $${queryParams.length}`;
    }

    query += ` ORDER BY st.id DESC`;

    console.log(filter);

    const allData: { name: string; qty: number; type: string, date: string }[] = await prisma.$queryRawUnsafe(query, ...queryParams);
    return allData.map((row) => ({
        name: row.name,
        qty: row.qty,
        type: row.type,
        date: row.date
    }));
}
