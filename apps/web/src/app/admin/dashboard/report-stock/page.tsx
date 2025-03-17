"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import api from "@/lib/axios";
import { Categories, Product } from "@/features/types/product";
import Store from "@/features/types/store";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Select from "react-select";

interface TransactionData {
    id: string;
    name: string;
    total_in: number;
    total_out: number;
    total: number;
}

const StockReportPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams();
    const user = useSelector((state: any) => state.auth.user);

    const { register, handleSubmit, control, watch } = useForm({
        defaultValues: {
            startMonth: "2025-01",
            endMonth: "2025-03",
            storeId: user?.store || '',
        },
    });

    const [products, setProducts] = useState<Product[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [categories, setCategories] = useState<Categories[]>([]);
    const [data, setData] = useState<TransactionData[]>([]);

    const storeId = watch("storeId");

    const fetchData = async (filters: any) => {
        try {
            const { data } = await api.get("/report/stock", { params: filters });
            setData(data.data);
        } catch (error) {
            console.error("Error fetching report:", error);
        }
    };

    const fetchStores = async () => {
        try {
            const res = await api.get("/master-data/stores");
            setStores(res.data.data);
        } catch (error) {
            console.error("Error fetching stores", error);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    const onSubmit = (formData: any) => {
        fetchData(formData);
    };

    return (
        <div className="w-full mx-[30px] mt-[30px]">
            <h1 className="text-2xl font-bold mb-4">Stock Report</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 mb-6">
                <input type="month" {...register("startMonth")} className="border p-2" />
                <input type="month" {...register("endMonth")} className="border p-2" />

                <Controller
                    control={control}
                    name="storeId"
                    render={({ field }) => (
                        <Select
                            className="w-full"
                            options={stores}
                            isClearable
                            isDisabled={user?.store}
                            getOptionLabel={(e) => e.name}
                            getOptionValue={(e) => String(e.id)}
                            onChange={(selectedOption) => field.onChange(selectedOption ? Number(selectedOption.id) : null)}
                            value={stores.find((option) => option.id === field.value) || null}
                        />
                    )}
                />

                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Filter
                </button>
            </form>

            <div>
                <table className="w-full border border-gray-300 shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-gray-200 text-gray-700">
                            <th className="px-4 py-2 border">Product</th>
                            <th className="px-4 py-2 border">IN</th>
                            <th className="px-4 py-2 border">OUT</th>
                            <th className="px-4 py-2 border">Total</th>
                            <th className="px-4 py-2 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((v) => (
                                <tr key={v.id} className="odd:bg-white even:bg-gray-100 hover:bg-gray-200 transition">
                                    <td className="px-4 py-2 border">{v.name}</td>
                                    <td className="px-4 py-2 border">{v.total_in}</td>
                                    <td className="px-4 py-2 border">{v.total_out}</td>
                                    <td className="px-4 py-2 border">{v.total}</td>
                                    <td className="p-3">
                                        <button className="bg-blue-500 py-1 px-4 mr-2 rounded-md text-white" onClick={() => router.push(`report-stock/${v.id}?storeId=${storeId}`)}>Detail</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-4 py-2 text-center border">Not Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>

        </div>
    );
};

export default StockReportPage;
