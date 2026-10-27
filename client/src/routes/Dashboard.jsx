import { Navbar } from "../components/Navbar"
import { SummaryCard } from "../components/SummaryCard"
import { CropCard } from "../components/CropCard"
import { useNavigate } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";
import { getLatestReading } from "../utils/getLatestReading.js";
import { calculateFarmStatus } from "../utils/calculateFarmStatus.js";

const API_URL = import.meta.env.VITE_API_URL;

export function Dashboard () {
    const navigate = useNavigate();
    const [crops, setCrops] = useState([]);
    const [readings, setReadings] = useState([]);
    const [error, setError] = useState("");
    const [lastRefresh, setLastRefresh] = useState(null);
    
    const cropCards = crops.map((crop) => ({
        crop,
        reading: getLatestReading(crop.crop_name, readings),
    }));

    const farmStatus = calculateFarmStatus(cropCards);

    const getCrops = async() => {
        try {
            setError("");
            const response = await axios.get(`${API_URL}/api/crops`);
            setCrops(response.data);
        } catch (error) {
            setError(
                error.response?.data?.error || "Failed to load crop cards."
            );
        }
    }

    const getReadings = async() => {
        try {
            setError("");
            const response = await axios.get(`${API_URL}/api/readings`);
            setReadings(response.data);
            setLastRefresh(new Date());
        } catch (error) {
            setError(
                error.response?.data?.error || "Failed to load crop sensor readings."
            );
        }
    }

    useEffect(() => {
        getCrops();
        getReadings();
    }, [])

    return (
        <div className="bg-[#F2F1F8] min-h-dvh text-[#111320]">
            <Navbar />
            <div className="p-8 pb-12">   
                <div className="flex justify-between items-center mb-6">
                    <p
                        style={{
                            fontFamily: "Inter"
                        }}
                        className="text-2xl font-semibold"
                    >Summary</p>
                    <div className="font-medium flex flex-col sm:flex-row">
                        <button 
                            type="button"
                            className="cursor-pointer rounded-[5px] px-4 py-3 border border-[#111320] bg-white text-sm"
                            onClick={() => {
                                getCrops();
                                getReadings();
                            }}
                        >Refresh Data</button>
                        <button
                            type="button"
                            className="cursor-pointer bg-[#111320] rounded-[5px] text-white px-4 py-3 text-sm mt-2 sm:mt-0 sm:ml-2"
                            onClick={() => {
                                navigate("/new")
                            }}
                        >Add Crop</button>
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
                        value={crops?.length}
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
                    style={{
                        fontFamily: "Inter"
                    }}
                    className="text-2xl font-semibold mt-12 mb-6"
                >Crops</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {crops.map((crop, index) => {
                        const latestReading = getLatestReading(crop.crop_name, readings);
                        return (
                            <CropCard 
                                key={index}
                                crop={crop} 
                                reading={latestReading} 
                                getCrops={getCrops}
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    )
}