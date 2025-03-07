"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "@/lib/axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useRouter } from 'next/navigation';

const AdminForm = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data } = await api.get(`/product-category/${params.id}`);
            formik.setFieldValue("name", data.data.name);
            formik.setFieldValue("description", data.data.description);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
        },
        validationSchema: Yup.object({
            name: Yup.string().required("Category Name is required"),
            description: Yup.string().required("Description is required"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                await api.patch(`/product-category/update/${params.id}`, values);
                toast.success('Successfully update category!', {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                });
                setTimeout(() => {
                    router.back();
                }, 1000)
                
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

    return (
        <div className="p-6 w-full mx-auto bg-white shadow-md rounded-lg">
            <ToastContainer transition={Bounce} closeOnClick={true} autoClose={3000} hideProgressBar={false} theme="colored" position="top-right" />
            <button className="bg-gray-400 text-white py-1 px-3 rounded mt-2 mb-[30px]" onClick={() => router.back()}>Back</button>
            <h1 className="text-xl font-bold mb-4">Create Category</h1>
            <hr className="my-4"></hr>
            <form onSubmit={formik.handleSubmit} className="space-y-4 mx-auto">
                <div>
                    <label className="block text-sm font-medium">Category Name</label>
                    <input
                        type="text"
                        name="name"
                        className="w-full border p-2 rounded"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.name && formik.errors.name && (
                        <p className="text-red-500 text-sm">{formik.errors.name}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <input
                        type="text"
                        name="description"
                        className="w-full border p-2 rounded"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.description && formik.errors.description && (
                        <p className="text-red-500 text-sm">{formik.errors.description}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white p-2 rounded mt-2"
                    disabled={loading}
                >
                    {loading ? "Updating..." : "Submit"}
                </button>
            </form>
        </div>
    );
};

export default AdminForm;
