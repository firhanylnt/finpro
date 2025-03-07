import * as Yup from "yup";

export const initialValues = {
    fullname: "",
    email: "",
    password: "",
    role_id: 0,
    store_id: 0,
    status: "true",
    created_by: "admin",
}

export const validationSchema = Yup.object({
    fullname: Yup.string().required("Fullname is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    role_id: Yup.number().required("Role is required"),
    store_id: Yup.number().nullable(),
    status: Yup.string().oneOf(["true", "false"]).required("Status is required"),
})