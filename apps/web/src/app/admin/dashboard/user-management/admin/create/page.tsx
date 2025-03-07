"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "@/lib/axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from 'next/navigation';
import Select from "react-select";
import Store from "@/features/types/store";
import Role from "@/features/types/roles";
import { initialValues, validationSchema } from "@/features/schema/adminSchema";

const AdminForm = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchRoles();
        fetchStores();
    }, []);

    const fetchRoles = async () => {
        try {
            const res = await api.get("/master-data/roles");
            setRoles(res.data.data);
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
                await api.post("/users/create", values);
                toast.success('Successfully create admin!');
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
            <h1 className="text-xl font-bold mb-4">Create Admin</h1>
            <form onSubmit={formik.handleSubmit} className="space-y-4 mx-auto">
                <div>
                    <label className="block text-sm font-medium">Fullname</label>
                    <input
                        type="text"
                        name="fullname"
                        className="w-full border p-2 rounded"
                        value={formik.values.fullname}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.fullname && formik.errors.fullname && (
                        <p className="text-red-500 text-sm">{formik.errors.fullname}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="w-full border p-2 rounded"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-sm">{formik.errors.email}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">Password</label>
                    <input
                        type="text"
                        name="password"
                        className="w-full border p-2 rounded"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-red-500 text-sm">{formik.errors.password}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">Role</label>
                    <Select
                        options={roles}
                        name="role_id"
                        getOptionLabel={(e) => e.name}
                        getOptionValue={(e) => String(e.id)}
                        onChange={(selectedOption) => formik.setFieldValue("role_id", selectedOption?.id)}
                        value={roles.find((option) => option.id === formik.values.role_id) || null}
                    />

                    {formik.touched.role_id && formik.errors.role_id && (
                        <p className="text-red-500 text-sm">{formik.errors.role_id}</p>
                    )}
                </div>

                {formik.values.role_id === 2 && (
                    <div>
                        <label className="block text-sm font-medium">Store</label>
                        <Select
                            options={stores}
                            name="store_id"
                            getOptionLabel={(e) => e.name}
                            getOptionValue={(e) => String(e.id)}
                            onChange={(selectedOption) => formik.setFieldValue("store_id", selectedOption?.id)}
                            value={stores.find((option) => option.id === formik.values.store_id) || null}
                        />
                        {formik.touched.store_id && formik.errors.store_id && (
                            <p className="text-red-500 text-sm">{formik.errors.store_id}</p>
                        )}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium">Status</label>
                    <select
                        name="status"
                        className="w-full border p-2 rounded"
                        value={formik.values.status}
                        onChange={formik.handleChange}
                    >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
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

export default AdminForm;
