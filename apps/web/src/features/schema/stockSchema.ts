import * as Yup from "yup";

export const initialValues = {
    product_id: 0,
    store_id: 0,
    qty: 0,
    tipe: "",
}

export const validationSchema = Yup.object({
    product_id: Yup.number().required("Product wajib diisi"),
    store_id: Yup.number().required("Store wajib diisi"),
    qty: Yup.number().required("QTY Wajib diisi"),
    tipe: Yup.string().oneOf(["IN", "OUT"]).required("Type wajib diisi"),
})