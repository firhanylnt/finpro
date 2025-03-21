"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import api from "@/lib/axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from 'next/navigation';
import { initialValues, validationSchema } from "@/features/schema/storeSchema";
import { useMap, useMapEvents } from "react-leaflet"; // Fix disini!

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });

const StoreForm = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                await api.post("/store/create", values);
                toast.success("Successfully created store!");
                setTimeout(() => router.back(), 1000);
            } catch (error: any) {
                toast.error(error?.response?.data.message || "Error creating store");
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
            <ToastContainer transition={Bounce} closeOnClick autoClose={3000} theme="colored" position="top-right" />
            <button className="bg-gray-400 text-white py-1 px-3 rounded mt-2 mb-4" onClick={() => router.back()}>Back</button>
            <h1 className="text-xl font-bold mb-4">Create Store</h1>
            <hr className="my-4" />

            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Store Name</label>
                    <input type="text" name="name" className="w-full border p-2 rounded"
                        value={formik.values.name} onChange={formik.handleChange} />
                    {formik.touched.name && formik.errors.name && <p className="text-red-500 text-sm">{formik.errors.name}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium">Description</label>
                    <input type="text" name="description" className="w-full border p-2 rounded"
                        value={formik.values.description} onChange={formik.handleChange} />
                    {formik.touched.description && formik.errors.description && <p className="text-red-500 text-sm">{formik.errors.description}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium">Latitude</label>
                    <input type="text" name="lat" className="w-full border p-2 rounded" value={formik.values.lat} readOnly />
                </div>

                <div>
                    <label className="block text-sm font-medium">Longitude</label>
                    <input type="text" name="long" className="w-full border p-2 rounded" value={formik.values.long} readOnly />
                </div>

                {/* OpenStreetMap - Leaflet with Search */}
                <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Select Location</label>
                    <MapContainer center={[Number(formik.values.lat), Number(formik.values.long)]} zoom={13} style={{ height: "300px", width: "100%" }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[Number(formik.values.lat), Number(formik.values.long)]} />
                        <MapClickHandler />
                        <SearchControl />
                    </MapContainer>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded mt-2" disabled={loading}>
                    {loading ? "Creating..." : "Submit"}
                </button>
            </form>
        </div>
    );
};

export default StoreForm;
