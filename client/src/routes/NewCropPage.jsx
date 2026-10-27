import { useNavigate } from "react-router";
import { CropForm } from "../components/CropForm";
import { Navbar } from "../components/Navbar";
import { FiArrowLeft } from "react-icons/fi";
import { getAvailableCropNames } from "../utils/getAvailableCropNames.js";
import { useEffect, useState } from "react";
import axios from "axios";
import { validateFormData } from "../utils/validateFormData.js";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

export function NewCropPage() {
    const navigate = useNavigate();

    const [crops, setCrops] = useState([]);
    const [readings, setReadings] = useState([]);
    const [availableCropNames, setAvailableCropNames] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                const [cropsResponse, readingsResponse] = await Promise.all([
                    axios.get(`${API_URL}/api/crops`),
                    axios.get(`${API_URL}/api/readings`),
                ]);

                setCrops(cropsResponse.data);
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

    const onCreate = async (formData) => {
        setError("");

        if (!validateFormData(formData, setError)) {
            return;
        }

        try {
            await axios.post(`${API_URL}/api/crops`, formData);
            toast.success("Crop created successfully.");
            navigate("/");
        } catch (error) {
            setError(
                error.response?.data?.error ||
                "Failed to create crop."
            );
        }
    };

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

                <CropForm
                    isEditing={false}
                    onSubmit={onCreate}
                    availableCropNames={availableCropNames}
                    error={error}
                />
            </div>
        </div>
    );
    }