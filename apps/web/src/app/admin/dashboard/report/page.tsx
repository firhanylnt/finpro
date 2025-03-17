"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import api from "@/lib/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Categories, Product } from "@/features/types/product";
import Store from "@/features/types/store";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import Select from "react-select";

interface TransactionData {
  month: string;
  total: number;
}

interface Table {
  name: string;
  total: number;
}

const ReportPage = () => {
  const searchParams = useSearchParams();
  const user = useSelector((state: any) => state.auth.user);

  const { register, handleSubmit, control, watch } = useForm({
    defaultValues: {
      startMonth: "2025-01",
      endMonth: "2025-03",
      storeId: user?.store || '',
      categoryId: '',
      productId: '',
    },
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [categories, setCategories] = useState<Categories[]>([]);
  const [data, setData] = useState<TransactionData[]>([]);
  const [listProduct, setListProduct] = useState<Table[]>([]);
  const [listCategories, setListCategories] = useState<Table[]>([]);

  const storeId = watch("storeId");
  const categoryId = watch("categoryId");

  const fetchData = async (filters: any) => {
    try {
      const { data } = await api.get("/report", { params: filters });
      setData(data.data.all);
      setListProduct(data.data.product);
      setListCategories(data.data.category);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get(`/master-data/products?storeId=${storeId}&categoryId=${categoryId || ""}`);
      setProducts(res.data.data);
    } catch (error) {
      console.error("Error fetching products", error);
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

  const fetchCategories = async () => {
    try {
      const res = await api.get("/master-data/categories");
      setCategories(res.data.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  useEffect(() => {
    fetchStores();
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [storeId, categoryId]);

  const onSubmit = (formData: any) => {
    fetchData(formData);
  };

  return (
    <div className="w-full mx-[30px] mt-[30px]">
      <h1 className="text-2xl font-bold mb-4">Transaction Report</h1>

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
              getOptionLabel={(e) => e.name}
              getOptionValue={(e) => String(e.id)}
              onChange={(selectedOption) => field.onChange(selectedOption ? Number(selectedOption.id) : null)}
              value={stores.find((option) => option.id === field.value) || null}
            />
          )}
        />

        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Select
              className="w-full"
              options={categories}
              isClearable
              getOptionLabel={(e) => e.name}
              getOptionValue={(e) => String(e.id)}
              onChange={(selectedOption) => field.onChange(selectedOption ? String(selectedOption.id) : null)}
              value={categories.find((option) => option.id === Number(field.value)) || null}
            />
          )}
        />

        <Controller
          control={control}
          name="productId"
          render={({ field }) => (
            <Select
              className="w-full"
              options={products}
              isClearable
              getOptionLabel={(e) => e.name}
              getOptionValue={(e) => String(e.id)}
              onChange={(selectedOption) => field.onChange(selectedOption ? String(selectedOption.id) : null)}
              value={products.find((option) => option.id === Number(field.value)) || null}
            />
          )}
        />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Filter
        </button>
      </form>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart width={600} height={300} data={data}>
          <XAxis
            dataKey="month"
            tickFormatter={(month) => {
              const [year, monthNum] = month.split("-");
              return new Date(year, monthNum - 1).toLocaleString("default", {
                month: "short",
                year: "numeric",
              });
            }}
          />
          <YAxis />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Line type="monotone" dataKey="total" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-6">
          <h1>Total Transaction by Product</h1>
          <table className="w-full border border-gray-300 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-4 py-2 border">Nama</th>
                <th className="px-4 py-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {listProduct.length > 0 ? (
                listProduct.map((v) => (
                  <tr key={v.name} className="odd:bg-white even:bg-gray-100 hover:bg-gray-200 transition">
                    <td className="px-4 py-2 border">{v.name}</td>
                    <td className="px-4 py-2 border">{v.total}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-4 py-2 text-center border">Not Found</td>
                </tr>
              )}
            </tbody>
          </table>

        </div>

        <div className="col-span-6">
        <h1>Total Transaction by Categories</h1>
          <table className="w-full border border-gray-300 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="px-4 py-2 border">Nama</th>
                <th className="px-4 py-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {listCategories.length > 0 ? (
                listCategories.map((v) => (
                  <tr key={v.name} className="odd:bg-white even:bg-gray-100 hover:bg-gray-200 transition">
                    <td className="px-4 py-2 border">{v.name}</td>
                    <td className="px-4 py-2 border">{v.total}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-4 py-2 text-center border">Not Found</td>
                </tr>
              )}
            </tbody>
          </table>

        </div>
      </div>

    </div>
  );
};

export default ReportPage;
