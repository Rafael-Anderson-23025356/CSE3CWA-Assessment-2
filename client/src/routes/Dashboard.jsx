import { Navbar } from "../components/Navbar";
import { SummaryCard } from "../components/SummaryCard";
import { CropCard } from "../components/CropCard";
import { useNavigate } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import { getLatestReading } from "../utils/getLatestReading.js";
import { calculateFarmStatus } from "../utils/calculateFarmStatus.js";

const API_URL = import.meta.env.VITE_API_URL;

export function Dashboard() {
    const navigate = useNavigate();
    const [crops, setCrops] = useState([]);
    const [readings, setReadings] = useState([]);
    const [error, setError] = useState("");
    const [lastRefresh, setLastRefresh] = useState(null);
    const [loading, setLoading] = useState(false);

    const cropCards = crops.map((crop) => ({
        crop,
        reading: getLatestReading(crop.crop_name, readings),
    }));

    const farmStatus = calculateFarmStatus(cropCards);

    const getCrops = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/crops`);
            setCrops(response.data);
            setError("");
        } catch (error) {
            setError(
                error.response?.data?.error || "Failed to load crop cards."
            );
        }
    };

    const getReadings = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/readings`);
            setReadings(response.data);
            setLastRefresh(new Date());
            setError("");
        } catch (error) {
            setError(
                error.response?.data?.error ||
                    "Failed to load crop sensor readings."
            );
        }
    };

    const refreshData = async () => {
        setLoading(true);

        try {
            await Promise.all([getCrops(), getReadings()]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <div className="bg-[#F2F1F8] min-h-dvh text-[#111320]">
            <Navbar />

            <div className="p-8 pb-12">
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <>
                        {error && (
                            <p className="mb-4 text-sm text-red-600">
                                {error}
                            </p>
                        )}

                        <div className="flex justify-between items-center mb-6">
                            <p
                                style={{ fontFamily: "Inter" }}
                                className="text-2xl font-semibold"
                            >
                                Summary
                            </p>

                            <div className="font-medium flex flex-col sm:flex-row">
                                <button
                                    type="button"
                                    className="cursor-pointer rounded-[5px] px-4 py-3 border border-[#111320] bg-white text-sm"
                                    onClick={refreshData}
                                >
                                    Refresh Data
                                </button>

                                <button
                                    type="button"
                                    className="cursor-pointer bg-[#111320] rounded-[5px] text-white px-4 py-3 text-sm mt-2 sm:mt-0 sm:ml-2"
                                    onClick={() => navigate("/new")}
                                >
                                    Add Crop
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <SummaryCard
                                label="Overall Farm Status"
                                value={farmStatus.status}
                                subtitle={farmStatus.message}
                            />

                            <SummaryCard
                                label="Crop Cards"
                                value={crops.length}
                                subtitle="Crops currently monitored"
                            />

                            <SummaryCard
                                label="Last Sensor Refresh"
                                value={
                                    lastRefresh
                                        ? lastRefresh.toLocaleTimeString([], {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                          })
                                        : "Not yet refreshed"
                                }
                                subtitle="Latest sensor data received"
                            />
                        </div>

                        <p
                            style={{ fontFamily: "Inter" }}
                            className="text-2xl font-semibold mt-12 mb-6"
                        >
                            Crops
                        </p>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {crops.length == 0 ? (
                                <div className="p-4 sm:p-16 bg-white rounded-[10px] min-h-[300px] flex flex-col justify-center">
                                    <p className="text-xl font-medium text-center">No crops yet</p>
                                    <p className="mt-2 text-sm text-gray-600 text-center">You haven't added any crops to your farm. Add your first crop to start monitoring soil moisture, temperature, and rainfall.</p>
                                </div>
                            ) : (
                                crops.map((crop) => {
                                    const latestReading = getLatestReading(
                                        crop.crop_name,
                                        readings
                                    );

                                    return (
                                        <CropCard
                                            key={crop.id}
                                            crop={crop}
                                            reading={latestReading}
                                            getCrops={getCrops}
                                        />
                                    );
                                })
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}