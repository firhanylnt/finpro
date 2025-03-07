import * as Yup from "yup";

export const initialValues = {
    name: "",
    product_category_id: "",
    description: "",
    price: "",
    status: "",
}

export const validationSchema = Yup.object({
    name: Yup.string().required("Nama produk wajib diisi"),
    product_category_id: Yup.number().required("Kategori produk wajib diisi"),
    description: Yup.string().required("Deskripsi wajib diisi"),
    price: Yup.number().positive("Harga harus lebih dari 0").required("Harga wajib diisi"),
    status: Yup.string().oneOf(["true", "false"], "Status tidak valid").required("Status wajib dipilih"),
})