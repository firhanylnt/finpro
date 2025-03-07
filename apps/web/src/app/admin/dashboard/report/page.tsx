"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
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

interface TransactionData {
  createdAt: string;
  quantity: number;
  total_price: number;
  product: { name: string };
}

interface Products {
  id: number;
  name: string;
}

interface Store {
  id: number;
  name: string;
}

const ReportPage = () => {
  const { register, handleSubmit } = useForm();
  const [products, setProducts] = useState<Products[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [data, setData] = useState<TransactionData[]>([]);

  const fetchData = async (filters: any) => {
    try {
      const response = await axios.get("/report/monthly", { params: filters });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("/master-data/products");
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

  useEffect(() => {
    fetchData({ startMonth: "2024-01", endMonth: "2024-12" });
    fetchProducts();
    fetchStores();
  }, []);

  const onSubmit = (formData: any) => {
    fetchData(formData);
  };

  return (
    <div className="w-full mx-[30px] mt-[30px]">
      <h1 className="text-2xl font-bold mb-4">Transaction Report</h1>

      {/* Filter Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4 mb-6">
        <input
          type="month"
          {...register("startMonth")}
          className="border p-2"
          defaultValue="2024-01"
        />
        <input
          type="month"
          {...register("endMonth")}
          className="border p-2"
          defaultValue="2024-12"
        />
        <select {...register("store_id")} className="w-full border p-2 rounded">
          <option value="">Select Store</option>
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </select>
        <select {...register("product_id")} className="w-full border p-2 rounded">
          <option value="">Select Product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Filter
        </button>
      </form>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <XAxis
            dataKey="createdAt"
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <YAxis />
          <Tooltip />
          <CartesianGrid strokeDasharray="3 3" />
          <Line type="monotone" dataKey="total_price" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReportPage;
