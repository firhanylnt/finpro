"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "@/lib/axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from 'next/navigation';
import Select from "react-select";
import {Product} from "@/features/types/product";
import Store from "@/features/types/store";
import { initialValues, validationSchema } from "@/features/schema/stockSchema";
import { useSelector } from "react-redux";

const StockForm = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const router = useRouter();
    const user = useSelector((state: any) => state.auth.user); 

    useEffect(() => {
        fetchProducts();
        fetchStores();
        if(user.store === null){
            setDisabled(false)
            formik.setFieldValue("store_id", Number(localStorage.getItem("storeId")));
        }else{
            formik.setFieldValue("store_id", user.store);
        }
    }, []);

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

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                await api.post("/stock/create", values);
                toast.success('Successfully create stock!');
                setTimeout(() => {
                    router.back();
                }, 3000)

            } catch (error: any) {
                toast.error(error?.response?.data.message);
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <div className="p-6 w-full mx-auto bg-white shadow-md rounded-lg">
            <ToastContainer transition={Bounce} closeOnClick={true} autoClose={3000} hideProgressBar={false} theme="colored" position="top-right" />
            <button className="bg-gray-400 text-white py-1 px-3 rounded mt-2 mb-[30px]" onClick={() => router.back()}>Back</button>
            <h1 className="text-xl font-bold mb-4">Create Stock</h1>
            <form onSubmit={formik.handleSubmit} className="space-y-4 mx-auto">

                <div>
                    <label className="block text-sm font-medium">Product</label>
                    <Select
                        options={products}
                        name="product_id"
                        getOptionLabel={(e) => e.name}
                        getOptionValue={(e) => String(e.id)}
                        onChange={(selectedOption) => formik.setFieldValue("product_id", selectedOption?.id)}
                        value={products.find((option) => option.id === formik.values.product_id) || null}
                    />

                    {formik.touched.product_id && formik.errors.product_id && (
                        <p className="text-red-500 text-sm">{formik.errors.product_id}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">Store</label>
                    <Select
                        options={stores}
                        name="store_id"
                        isDisabled={disabled}
                        getOptionLabel={(e) => e.name}
                        getOptionValue={(e) => String(e.id)}
                        onChange={(selectedOption) => formik.setFieldValue("store_id", selectedOption?.id)}
                        value={stores.find((option) => option.id === formik.values.store_id) || null}
                    />
                    {formik.touched.store_id && formik.errors.store_id && (
                        <p className="text-red-500 text-sm">{formik.errors.store_id}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">QTY</label>
                    <input
                        type="number"
                        name="qty"
                        className="w-full border p-2 rounded"
                        value={formik.values.qty}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.qty && formik.errors.qty && (
                        <p className="text-red-500 text-sm">{formik.errors.qty}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">Type</label>
                    <select
                        name="tipe"
                        className="w-full border p-2 rounded"
                        value={formik.values.tipe}
                        onChange={formik.handleChange}
                    >
                        <option value="">Select Type</option>
                        <option value="IN">IN</option>
                        <option value="OUT">OUT</option>
                    </select>
                    {formik.touched.tipe && formik.errors.tipe && (
                        <p className="text-red-500 text-sm">{formik.errors.tipe}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded mt-2"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Submit"}
                </button>
            </form>
        </div>
    );
};

export default StockForm;
