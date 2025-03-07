"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import api from "@/lib/axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from 'next/navigation';
import { initialValues, validationSchema } from "@/features/schema/discountSchema";
import { Product } from "@/features/types/product";
import DiscountType from "@/features/types/discountType";
import Store from "@/features/types/store";
import Select from "react-select";

const createDiscount = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [discountType, setDiscountType] = useState<DiscountType[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchProducts();
        fetchStores();
        fetchDiscountType();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get("/master-data/products");
            setProducts(res.data.data);
        } catch (error) {
            console.error("Error fetching products", error);
        }
    };

    const fetchDiscountType = async () => {
        try {
            const res = await api.get("/master-data/discount-type");
            setDiscountType(res.data.data);
        } catch (error) {
            console.error("Error fetching roles", error);
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
                await api.post("/discount/create", values);
                toast.success('Successfully create discount!');
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
            <h1 className="text-xl font-bold mb-4">Create Discount</h1>
            <form onSubmit={formik.handleSubmit} className="space-y-4 mx-auto">
            <div>
                    <label className="block text-sm font-medium">Discount Type</label>
                    <Select
                        options={discountType}
                        placeholder="Select Discount Type"
                        name="discount_type_id"
                        getOptionLabel={(e) => e.name}
                        getOptionValue={(e) => String(e.id)}
                        onChange={(selectedOption) => formik.setFieldValue("discount_type_id", String(selectedOption?.id))}
                        value={discountType.find((option) => option.id === Number(formik.values.discount_type_id)) || null}
                    />
                    {formik.touched.discount_type_id && formik.errors.discount_type_id && (
                        <p className="text-red-500 text-sm">{formik.errors.discount_type_id}</p>
                    )}
                </div>
                
                <div>
                    <label className="block text-sm font-medium">Discount Name</label>
                    <input type="text" name="name" className="w-full border p-2 rounded" value={formik.values.name} onChange={formik.handleChange}/>
                    {formik.touched.name && formik.errors.name && (
                        <p className="text-red-500 text-sm">{formik.errors.name}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">Coupon</label>
                    <input type="text" name="coupon" className="w-full border p-2 rounded" value={formik.values.coupon} onChange={formik.handleChange} />
                    {formik.touched.coupon && formik.errors.coupon && (
                        <p className="text-red-500 text-sm">{formik.errors.coupon}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">Store</label>
                    <Select
                        options={stores}
                        placeholder="Select Store"
                        name="store_id"
                        getOptionLabel={(e) => e.name}
                        getOptionValue={(e) => String(e.id)}
                        onChange={(selectedOption) => formik.setFieldValue("store_id", String(selectedOption?.id))}
                        value={stores.find((option) => option.id === Number(formik.values.store_id)) || null}
                    />
                    {formik.touched.store_id && formik.errors.store_id && (
                        <p className="text-red-500 text-sm">{formik.errors.store_id}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">Product</label>
                    <Select
                        options={products}
                        placeholder="Select Product"
                        name="product_id"
                        getOptionLabel={(e) => e.name}
                        getOptionValue={(e) => String(e.id)}
                        onChange={(selectedOption) => formik.setFieldValue("product_id", String(selectedOption?.id))}
                        value={products.find((option) => option.id === Number(formik.values.product_id)) || null}
                    />
                    {formik.touched.product_id && formik.errors.product_id && (
                        <p className="text-red-500 text-sm">{formik.errors.product_id}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">Start Date</label>
                    <input type="date" name="start_date" className="w-full border p-2 rounded" value={formik.values.start_date} onChange={formik.handleChange} />
                    {formik.touched.start_date && formik.errors.start_date && (
                        <p className="text-red-500 text-sm">{formik.errors.start_date}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">End Date</label>
                    <input type="date" name="end_date" className="w-full border p-2 rounded" value={formik.values.end_date} onChange={formik.handleChange} />
                    {formik.touched.end_date && formik.errors.end_date && (
                        <p className="text-red-500 text-sm">{formik.errors.end_date}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">Amount</label>
                    <input type="number" name="amount" className="w-full border p-2 rounded" value={formik.values.amount} onChange={formik.handleChange} />
                    {formik.touched.amount && formik.errors.amount && (
                        <p className="text-red-500 text-sm">{formik.errors.amount}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">Minimal Purchase Amount</label>
                    <input type="number" name="min_purchase" className="w-full border p-2 rounded" value={formik.values.min_purchase} onChange={formik.handleChange} />
                    {formik.touched.min_purchase && formik.errors.min_purchase && (
                        <p className="text-red-500 text-sm">{formik.errors.min_purchase}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">Maximal Discount Amount</label>
                    <input type="number" name="max_discount" className="w-full border p-2 rounded" value={formik.values.max_discount} onChange={formik.handleChange} />
                    {formik.touched.max_discount && formik.errors.max_discount && (
                        <p className="text-red-500 text-sm">{formik.errors.max_discount}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">Status</label>
                    <select name="status" className="w-full border p-2 rounded" value={formik.values.status} onChange={formik.handleChange} >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded mt-2" disabled={loading} >
                    {loading ? "Creating..." : "Submit"}
                </button>
            </form>
        </div>
    );
};

export default createDiscount;
