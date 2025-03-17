"use client";

import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "@/lib/axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useRouter } from 'next/navigation';
import { initialValues, validationSchema } from "@/features/schema/storeSchema";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder";

const AdminForm = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const { data } = await api.get(`/store/${params.id}`);
            formik.setFieldValue("name", data.data.name);
            formik.setFieldValue("lat", data.data.lat);
            formik.setFieldValue("long", data.data.long);
            formik.setFieldValue("description", data.data.description);
        } catch (error) {
            console.error("Error fetching store", error);
        }
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                await api.patch(`/store/update/${params.id}`, values);
                toast.success('Successfully update store!');
                setTimeout(() => {
                    router.back();
                }, 1000)
                
            } catch (error: any) {
                toast.error(error?.response?.data.message);
            } finally {
                setLoading(false);
            }
        },
    });

    const MapClickHandler = () => {
        useMapEvents({
            click(e) {
                formik.setFieldValue("lat", String(e.latlng.lat));
                formik.setFieldValue("long", String(e.latlng.lng));
            },
        });
        return null;
    };

    const SearchControl = () => {
        const map = useMap();

        useEffect(() => {
            if (!map) return;

            const L = require("leaflet");
            const geocoder = L.Control.geocoder({
                defaultMarkGeocode: false,
            })
            .on("markgeocode", function (e: any) {
                const latlng = e.geocode.center;
                formik.setFieldValue("lat", String(latlng.lat));
                formik.setFieldValue("long", String(latlng.lng));
                map.setView(latlng, 13);
            })
            .addTo(map);

            return () => {
                map.removeControl(geocoder);
            };
        }, [map]);

        return null;
    };

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

                <div>
                    <label className="block text-sm font-medium">Latitude</label>
                    <input
                        type="text"
                        name="lat"
                        className="w-full border p-2 rounded"
                        value={formik.values.lat}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.lat && formik.errors.lat && (
                        <p className="text-red-500 text-sm">{formik.errors.lat}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium">Longitude</label>
                    <input
                        type="text"
                        name="long"
                        className="w-full border p-2 rounded"
                        value={formik.values.long}
                        onChange={formik.handleChange}
                    />
                    {formik.touched.long && formik.errors.long && (
                        <p className="text-red-500 text-sm">{formik.errors.long}</p>
                    )}
                </div>

                <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Select Location</label>
                    <MapContainer center={[Number(formik.values.lat), Number(formik.values.long)]} zoom={13} style={{ height: "300px", width: "100%" }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[Number(formik.values.lat), Number(formik.values.long)]} />
                        <MapClickHandler />
                        <SearchControl />
                    </MapContainer>
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
