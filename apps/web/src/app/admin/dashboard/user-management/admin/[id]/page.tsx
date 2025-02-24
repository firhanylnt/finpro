"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "@/lib/axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter, useParams } from 'next/navigation';

interface Role {
    id: number;
    name: string;
}

interface Store {
    id: number;
    name: string;
}

const AdminForm = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        fetchRoles();
        fetchStores();
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data } = await api.get(`/users/${params.id}`);
            formik.setFieldValue("fullname", data.data.fullname);
            formik.setFieldValue("email", data.data.email);
            formik.setFieldValue("role_id", data.data.role_id);
            formik.setFieldValue("store_id", data.data.store_id ?? 0);
        } catch (error) {
            console.error("Error fetching roles", error);
        }
    };

    const fetchRoles = async () => {
        try {
            const { data } = await api.get("/master-data/roles");
            setRoles(data.data);
        } catch (error) {
            console.error("Error fetching roles", error);
        }
    };

    const fetchStores = async () => {
        try {
            const { data } = await api.get("/master-data/stores");
            setStores(data.data);
        } catch (error) {
            console.error("Error fetching stores", error);
        }
    };

    const formik = useFormik({
        initialValues: {
            fullname: "",
            email: "",
            password: "",
            role_id: 0,
            store_id: 0,
            status: "true",
            created_by: "admin",
        },
        validationSchema: Yup.object({
            fullname: Yup.string().required("Fullname is required"),
            email: Yup.string().email("Invalid email").required("Email is required"),
            password: Yup.string().min(6, "Password must be at least 6 characters").nullable(),
            role_id: Yup.number().required("Role is required"),
            store_id: Yup.number().nullable(),
            status: Yup.string().oneOf(["true", "false"]).required("Status is required"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                await api.patch(`/users/update/${params.id}`, values);
                toast.success('Successfully update data!', {
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

    return (
        <div className="p-6 w-full mx-auto bg-white shadow-md rounded-lg">
            <ToastContainer />
            <button className="bg-gray-400 text-white py-1 px-3 rounded mt-2 mb-[30px]" onClick={() => router.back()}>Back</button>
            <h1 className="text-xl font-bold mb-4">Edit Admin</h1>
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
                        placeholder="leave it blank if you dont want to change password"
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-red-500 text-sm">{formik.errors.password}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">Role</label>
                    <select
                        name="role_id"
                        className="w-full border p-2 rounded"
                        value={formik.values.role_id}
                        onChange={(e) => formik.setFieldValue("role_id", Number(e.target.value))} // Convert string to number
                    >
                        <option value="">Select Role</option>
                        {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                                {role.name}
                            </option>
                        ))}
                    </select>

                    {formik.touched.role_id && formik.errors.role_id && (
                        <p className="text-red-500 text-sm">{formik.errors.role_id}</p>
                    )}
                </div>

                {formik.values.role_id === 2 && (
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
                    {loading ? "Updating..." : "Submit"}
                </button>
            </form>
        </div>
    );
};

export default AdminForm;
