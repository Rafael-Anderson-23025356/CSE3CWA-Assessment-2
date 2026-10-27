import { Navbar } from "../components/Navbar"
import { SummaryCard } from "../components/SummaryCard"
import { CropCard } from "../components/CropCard"
import { useNavigate } from "react-router";
import axios from "axios";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export function Dashboard () {
    const navigate = useNavigate();
    const [crops, setCrops] = useState([]);
    const [error, setError] = useState("");

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

    useEffect(() => {
        getCrops();
    }, [])

    return (
        <div className="bg-[#F2F1F8] min-h-dvh text-[#111320]">
            <Navbar />
            <div className="p-8 pb-12 max-w-7xl mx-auto">   
                <div className="flex justify-between items-center mb-6">
                    <p
                        style={{
                            fontFamily: "Inter"
                        }}
                        className="text-2xl font-semibold"
                    >Summary</p>
                    <div className="font-medium">
                        <button 
                            type="button"
                            className="cursor-pointer rounded-[5px] px-4 py-3 border border-[#111320] bg-white text-sm"
                            onClick={() => {
                                getCrops();
                            }}
                        >Refresh Data</button>
                        <button
                            type="button"
                            className="cursor-pointer bg-[#111320] rounded-[5px] text-white px-4 py-3 text-sm ml-2"
                            onClick={() => {
                                navigate("/new")
                            }}
                        >Add Crop</button>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-x-4">
                    <SummaryCard
                        label="Overall Farm Status"
                        value="Watch"
                        subtitle="Some crops need attention"
                    />

                    <SummaryCard
                        label="Crop Cards"
                        value="3"
                        subtitle="Crops currently monitored"
                    />

                    <SummaryCard
                        label="Last Sensor Refresh" 
                        value="10:35 AM"
                        subtitle="Latest sensor data received"
                    />
                </div>
                <p
                    style={{
                        fontFamily: "Inter"
                    }}
                    className="text-2xl font-semibold mt-12 mb-6"
                >Crops</p>
                <div className="grid grid-cols-1 gap-4">
                    {crops.map((crop) => (
                        <CropCard crop={crop} />
                    ))}
                </div>
            </div>
        </div>
    )
}