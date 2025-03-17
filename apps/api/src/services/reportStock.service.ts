import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const jurnalStock = async (filter: any) => {
    const queryParams: any[] = [];
    let query = `
    SELECT
        p.name,
        st.name as store_name,
        (
            SELECT COALESCE(SUM(qty), 0) 
            FROM public."JurnalStock" 
            WHERE stock_id = s.id 
            AND store_id = $${queryParams.length + 1} 
            AND type = 'IN'
        ) AS total_in,
        (
            SELECT COALESCE(SUM(qty), 0) 
            FROM public."JurnalStock" 
            WHERE stock_id = s.id 
            AND store_id = $${queryParams.length + 1} 
            AND type = 'OUT'
        ) AS total_out,
        (
            SELECT COALESCE(SUM(qty), 0) 
            FROM public."JurnalStock" 
            WHERE stock_id = s.id 
            AND store_id = $${queryParams.length + 1} 
            AND type = 'IN'
        ) - (
            SELECT COALESCE(SUM(qty), 0) 
            FROM public."JurnalStock" 
            WHERE stock_id = s.id 
            AND store_id = $${queryParams.length + 1} 
            AND type = 'OUT'
        ) AS total_stock
    FROM public."Products" p
    JOIN public."Stock" s ON s.product_id = p.id
    JOIN public."JurnalStock" js ON js.stock_id = s.id
    JOIN public."Stores" st ON st.id = s.store_id
    ${filter.storeId ? `where st.id = $${queryParams.length + 1}` : ''}
`;

    queryParams.push(filter.storeId);

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

    query += ` GROUP BY p.name, s.id, st.name ORDER BY p.name`;

    const allData: { name: string; store_name: string, total_in: bigint, total_out: bigint, total_stock: bigint }[] = await prisma.$queryRawUnsafe(query, ...queryParams);

    return allData.map((row) => ({
        name: row.name,
        store_name: row.store_name,
        total_in: Number(row.total_in),
        total_out: Number(row.total_out),
        total: Number(row.total_stock),
    }));

}