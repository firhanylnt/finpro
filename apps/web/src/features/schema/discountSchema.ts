import * as Yup from "yup";

export const initialValues = {
    name: "",
    coupon: "",
    discount_type_id: "",
    amount: 0,
    min_purchase: 0,
    max_discount: 0,
    store_id: "",
    product_id: "",
    start_date: "",
    end_date: "",
    status: "true",
}

export const validationSchema = Yup.object({
    name: Yup.string().required("Discount name is required"),
    coupon: Yup.string().nullable(),
    discount_type_id: Yup.number().required("Discount type is required"),
    store_id: Yup.number().nullable(),
    amount: Yup.number().nullable(),
    product_id: Yup.number().nullable(),
    min_purchase: Yup.number().nullable(),
    max_discount: Yup.number().nullable(),
    start_date: Yup.date().required("Start date is required"),
    end_date: Yup.date().required("End date is required"),
    status: Yup.string().oneOf(["true", "false"]).required("Status is required"),
})