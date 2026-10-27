import { useNavigate, useParams } from "react-router";
import { CropForm } from "../components/CropForm";
import { Navbar } from "../components/Navbar";
import { FiArrowLeft } from "react-icons/fi";
import { getAvailableCropNames } from "../utils/getAvailableCropNames.js";
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export function EditCropPage() {
    const navigate = useNavigate();

    const [crop, setCrop] = useState(null);
    const [crops, setCrops] = useState([]);
    const [readings, setReadings] = useState([]);
    const [availableCropNames, setAvailableCropNames] = useState([]);
    const [error, setError] = useState("");

    const { id } = useParams();

    useEffect(() => {
        async function loadData() {
            try {
                const [cropsResponse, readingsResponse, cropResponse] = await Promise.all([
                    axios.get(`${API_URL}/api/crops`),
                    axios.get(`${API_URL}/api/readings`),
                    axios.get(`${API_URL}/api/crops/${id}`),
                ]);

                setCrops(cropsResponse.data);
                setCrop(cropResponse.data);
                setReadings(readingsResponse.data);

                setAvailableCropNames(
                    getAvailableCropNames(readingsResponse.data, cropsResponse.data)
                );
            } catch (error) {
                setError(
                error.response?.data?.error ||
                    "Failed to load crop names."
                );
            }
        }

        loadData();
    }, []);

    const onUpdate = async (formData) => {
        try {
            await axios.put(`${API_URL}/api/crops/${id}`, formData);
            navigate("/");
        } catch (error) {
            alert(
            error.response?.data?.error || "Failed to update crop."
            );
        }
    };

    useEffect(() => {
        console.log("Crop: ", crop)
    }, [crop])

    return (
        <div
            className="bg-[#F2F1F8] min-h-dvh text-[#111320]"
            style={{ fontFamily: "Inter" }}
        >
            <Navbar />

            <div className="p-8 pb-12 max-w-3xl mx-auto">
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="mb-6 inline-flex items-center gap-2 rounded-md text-sm font-medium text-gray-600 transition-colors hover:text-[#111320] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111320]/20 cursor-pointer"
                >
                <FiArrowLeft size={18} />
                    Back to Dashboard
                </button>

                {error && (
                    <p className="mb-4 text-sm text-red-600">{error}</p>
                )}

                {crop && (
                    <CropForm
                        key={crop.id}
                        isEditing={true}
                        onSubmit={onUpdate}
                        availableCropNames={availableCropNames}
                        crop={crop}
                    />
                )}
            </div>
        </div>
    );
    }