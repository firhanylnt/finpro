"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "@/lib/axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, useParams } from 'next/navigation';

interface Product {
    id: number;
    name: string;
}

interface Store {
    id: number;
    name: string;
}

const StockForm = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const params = useParams();

    const fetchData = async () => {
        try {
            const { data } = await api.get(`/stock/${params.id}`);
            formik.setFieldValue("product_id", data.data.product_id);
            formik.setFieldValue("store_id", data.data.store_id ?? 0);
        } catch (error) {
            console.error("Error fetching roles", error);
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

    const formik = useFormik({
        initialValues: {
            product_id: 0,
            store_id: 0,
            qty: 0,
            tipe: "",
        },
        validationSchema: Yup.object({
            product_id: Yup.number().required("Product wajib diisi"),
            store_id: Yup.number().required("Store wajib diisi"),
            qty: Yup.number().required("QTY Wajib diisi"),
            tipe: Yup.string().oneOf(["IN", "OUT"]).required("Type wajib diisi"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                await api.post("/stock/create", values);
                toast.success('Successfully create stock!', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                });
                setTimeout(() => {
                    router.back();
                }, 3000)

            } catch (error: any) {
                toast.error(error?.response?.data.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                });
            } finally {
                setLoading(false);
            }
        },
    });

    useEffect(() => {
        fetchData();
        fetchProducts();
        fetchStores();
    }, []);

    return (
        <div className="p-6 w-full mx-auto bg-white shadow-md rounded-lg">
            <ToastContainer transition={Bounce} closeOnClick={true} autoClose={3000} hideProgressBar={false} theme="colored" position="top-right" />
            <button className="bg-gray-400 text-white py-1 px-3 rounded mt-2 mb-[30px]" onClick={() => router.back()}>Back</button>
            <h1 className="text-xl font-bold mb-4">Create Stock</h1>
            <form onSubmit={formik.handleSubmit} className="space-y-4 mx-auto">

                <div>
                    <label className="block text-sm font-medium">Product</label>
                    <select
                        name="product_id"
                        className="w-full border p-2 rounded"
                        value={formik.values.product_id}
                        onChange={(e) => formik.setFieldValue("product_id", Number(e.target.value))}
                    >
                        <option value="">Select Product</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                    </select>

                    {formik.touched.product_id && formik.errors.product_id && (
                        <p className="text-red-500 text-sm">{formik.errors.product_id}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">Store</label>
                    <select
                        name="store_id"
                        className="w-full border p-2 rounded"
                        value={formik.values.store_id}
                        onChange={formik.handleChange}
                    >
                        <option value="">Select Store</option>
                        {stores.map((store) => (
                            <option key={store.id} value={store.id}>
                                {store.name}
                            </option>
                        ))}
                    </select>
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
