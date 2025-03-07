"use client";

import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import api from "@/lib/axios";
import * as Yup from "yup";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from 'next/navigation';
import { Categories } from "@/features/types/product";
import { initialValues, validationSchema } from "@/features/schema/productSchema";

export default function ProductForm() {
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [category, setCategory] = useState<Categories[]>([]);
    const router = useRouter();

    const handleSubmit = async (values: any, { resetForm }: any) => {
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("product_category_id", values.product_category_id);
            formData.append("description", values.description);
            formData.append("price", values.price);
            formData.append("status", values.status);

            selectedImages.forEach((file) => {
                formData.append("images", file);
            });

            await api.post("/product/create", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            resetForm();
            setSelectedImages([]);
            toast.success('Successfully create product!');
            setTimeout(() => {
                router.back();
            }, 3000)
        } catch (error: any) {
            toast.error(error?.response?.data.message);
        }
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFiles = Array.from(files);

            const validFiles = newFiles.filter(
                (file) =>
                    ["image/png", "image/jpeg", "image/gif"].includes(file.type) && file.size <= 1024 * 1024
            );

            if (validFiles.length !== newFiles.length) {
                alert("Beberapa file tidak valid (hanya .jpg, .jpeg, .png, .gif dan maks 1MB)");
            }

            setSelectedImages((prev) => [...prev, ...validFiles]);
        }
    };

    const removeImage = (index: number) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get("/master-data/categories");
            setCategory(res.data.data);
        } catch (error) {
            console.error("Error fetching categories", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg">
            <ToastContainer transition={Bounce} closeOnClick={true} autoClose={3000} hideProgressBar={false} theme="colored" position="top-right" />
            <h2 className="text-2xl font-semibold mb-4">Tambah Produk</h2>

            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className="mb-3">
                            <Field name="name" placeholder="Nama Produk" className="w-full p-2 border rounded" />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div className="mb-3">
                            <Field as="select" name="product_category_id" className="w-full p-2 border rounded">
                                <option value="">Pilih Category</option>
                                {category.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </Field>
                            <ErrorMessage name="status" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div className="mb-3">
                            <Field as="textarea" name="description" placeholder="Deskripsi" className="w-full p-2 border rounded" />
                            <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div className="mb-3">
                            <Field name="price" type="number" placeholder="Harga" className="w-full p-2 border rounded" />
                            <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div className="mb-3">
                            <Field as="select" name="status" className="w-full p-2 border rounded">
                                <option value="">Pilih Status</option>
                                <option value="true">Aktif</option>
                                <option value="false">Tidak Aktif</option>
                            </Field>
                            <ErrorMessage name="status" component="div" className="text-red-500 text-sm mt-1" />
                        </div>

                        <div className="mb-3">
                            <input type="file" multiple accept="image/png, image/jpeg, image/gif" onChange={handleImageChange} className="w-full p-2 border rounded" />

                            {selectedImages.length > 0 && (
                                <div className="mt-3 grid grid-cols-4 gap-2">
                                    {selectedImages.map((file, index) => (
                                        <div key={index} className="relative">
                                            <img src={URL.createObjectURL(file)} alt="preview" className="w-[200px] object-cover rounded border" />
                                            <button type="button" onClick={() => removeImage(index)} className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded-bl">
                                                X
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button type="submit" disabled={isSubmitting} className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600">
                            {isSubmitting ? "Creating..." : "Simpan"}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
