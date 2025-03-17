import * as Yup from "yup";

export const initialValues = {
    name: "",
    description: "",
    lat: "-6.200000", 
    long: "106.816666"
}

export const validationSchema = Yup.object({
    name: Yup.string().required("Store Name is required"),
    description: Yup.string().required("Description is required"),
    lat: Yup.string().required("Latitude is required"),
    long: Yup.string().required("Longitude is required"),
})