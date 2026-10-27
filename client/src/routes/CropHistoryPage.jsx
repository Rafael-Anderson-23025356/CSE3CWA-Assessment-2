import { Navbar } from "../components/Navbar";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { HistoryEntry } from "../components/HistoryEntry";

const API_URL = import.meta.env.VITE_API_URL;

export function CropHistoryPage () {
    const navigate = useNavigate();
    const [readings, setReadings] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        const getReadings = async() => {
            try {
                const crop = await axios.get(`${API_URL}/api/crops/${id}`);
                const reading = await axios.get(`${API_URL}/api/readings`);

                const filteredReadings = reading.data.filter(
                    (item) => item.crop_name === crop.data.crop_name
                );
                setReadings(filteredReadings);
            } catch (err) {
                console.log(err);
            }
        }
        getReadings();
    }, [id])

    return (
        <div
            className="bg-[#F2F1F8] min-h-dvh text-[#111320]"
            style={{ fontFamily: "Inter" }}
        >
            <Navbar />

            <div className="p-8 pb-12">
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="mb-6 inline-flex items-center gap-2 rounded-md text-sm font-medium text-gray-600 transition-colors hover:text-[#111320] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111320]/20 cursor-pointer"
                >
                <FiArrowLeft size={18} />
                    Back to Dashboard
                </button>
                <p
                    style={{ fontFamily: "Inter" }}
                    className="text-2xl font-semibold"
                >
                    Crop Sensor History
                </p>

                <p className="mt-2 text-sm text-gray-500 mb-6">
                    View historical sensor readings and track your crop's growing conditions over time.
                </p>
                <div className="space-y-4">
                    {readings.length > 0 ? (
                        readings.map((reading, index) => (
                            <HistoryEntry
                                key={`${reading.timestamp}-${index}`}
                                reading={reading}
                            />
                        ))
                    ) : (
                        <p className="rounded-lg bg-white p-6 text-center text-sm text-gray-500">
                            No sensor history available for this crop.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}