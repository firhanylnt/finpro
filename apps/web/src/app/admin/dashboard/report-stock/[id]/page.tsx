"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import api from "@/lib/axios";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "@/components/admin/pagination";
import { useSelector } from "react-redux";
import {ReportStock} from "@/features/types/stock";
import Store from "@/features/types/store";

interface JurnalStock {
    name: string;
    qty: number;
    type: string;
    date: string;
}

const DetailStockPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const user = useSelector((state: any) => state.auth.user);
    const params = useParams();

    const [storeId, setStoreId] = useState<number | null>(searchParams.get("storeId") || user?.store || localStorage.getItem("storeId") || null);
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "name");
    const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "asc");
    const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
    const [stock, setStock] = useState<JurnalStock[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        if (!storeId) return;
        setLoading(true);
        const query = new URLSearchParams({ storeId: storeId.toString(), search, sortBy, sortOrder, page: page.toString() }).toString();
        const res = await api(`/report/stock/${params.id}?${query}`);
        const { data } = res.data;
        setStock(data);
        setLoading(false);
    };

    const updateQueryParams = (params: Record<string, string | number>) => {
        const newParams = new URLSearchParams(searchParams.toString());
        Object.keys(params).forEach((key) => {
            if (params[key]) newParams.set(key, String(params[key]));
            else newParams.delete(key);
        });
        router.push(`?${newParams.toString()}`);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        updateQueryParams({ search: e.target.value, page: 1 });
    };

    const handleSort = (field: string) => {
        const newSortOrder = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
        setSortBy(field);
        setSortOrder(newSortOrder);
        updateQueryParams({ sortBy: field, sortOrder: newSortOrder });
    };

    const handlePageChange = (newPage: number) => {
        if (newPage < 1) return;
        setPage(newPage);
        updateQueryParams({ page: newPage });
    };

    const handleStoreSelect = (selectedStoreId: number) => {
        localStorage.setItem("storeId", String(selectedStoreId));
        setStoreId(selectedStoreId);
        updateQueryParams({ storeId: selectedStoreId });
    };

    useEffect(() => {
        fetchData();
    }, [searchParams.toString()]);

    return (
        <div className="w-full mx-[30px] mt-[30px]">
            <h1 className="text-2xl mb-6 text-gray-800">Product Stock</h1>

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="w-full border-collapse border-gray-900">
                    <thead>
                        <tr className="bg-gray-900 text-left text-white border-gray-900">
                            <th className="border p-3 cursor-pointer" onClick={() => handleSort("name")}>
                                Name {sortBy === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                            </th>
                            <th className="border p-3">Type</th>
                            <th className="border p-3">Qty</th>
                            <th className="border p-3">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={3} className="p-4 text-center text-gray-500">Loading...</td>
                            </tr>
                        ) : stock.length > 0 ? (
                            stock.map((stock: JurnalStock) => (
                                <tr key={stock.name} className="border-b hover:bg-gray-50 text-center">
                                    <td className="p-3 border-1 border-black">{stock.name}</td>
                                    <td className="p-3">{stock.type}</td>
                                    <td className="p-3">{stock.qty}</td>
                                    <td className="p-3">{stock.date}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="p-4 text-center text-gray-500">No data found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default DetailStockPage;
