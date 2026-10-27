import { DetailCard } from "./DetailCard";
import { HiDotsVertical } from "react-icons/hi";
import { useState } from "react";
import { FiEdit2, FiTrash2, FiClock } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router";

const API_URL = import.meta.env.VITE_API_URL;

export function CropCard ({crop, reading, getCrops}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const deleteCropById = async(id) => {
        try{
            await axios.delete(`${API_URL}/api/crops/${id}`);
            console.log("Deletion successful.");
        }catch(err){
            console.log(err.message);
        }
    }

    return (
        <div className="p-4 bg-white rounded-[10px]">
            <div className="flex justify-between items-center">
                <div className="flex-1">
                    <p className="text-xl font-medium">{crop.crop_name}</p>
                </div>
                <div className="flex gap-x-2">
                    <div className="cursor-pointer p-2 border rounded-[10px] border-gray-600/30">
                        <FiClock  
                            size={20} 
                        />
                    </div>
                    <div className="relative h-fit w-fit p-2">
                        <HiDotsVertical 
                            size={20} 
                            className="cursor-pointer"
                            onClick={() => {
                                setMenuOpen(!menuOpen)
                            }}
                        />

                        {menuOpen && (
                            <div className="absolute right-0 top-full z-10 w-36 rounded-lg border border-gray-200 bg-white p-1 shadow-lg mt-2   ">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        navigate(`/edit/${crop?.id}`)
                                    }}
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                                >
                                    <FiEdit2 size={15} />
                                    Edit
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        deleteCropById(crop.id);
                                        setMenuOpen(false);
                                        getCrops();
                                    }}
                                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    <FiTrash2 size={15} />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex mt-2 text-sm gap-2">
                <p>
                    <span className="font-medium">Location: </span>
                    {crop.location}
                </p>
                <p>|</p>
                <p>
                    <span className="font-medium">Target Moisture: </span>
                    {crop.target_min}-{crop.target_max}%
                </p>
                <p>|</p>
                <p>
                    <span className="font-medium">Normal Water: </span>
                    {crop.normal_water}L
                </p>
            </div>
            <p className="text-sm mt-1">
                <span className="font-medium">Notes: </span>
                {crop.notes?.trim() || "-"}
            </p>
            <div className="bg-gray-600/30 h-[0.1px] my-4"></div>
            <div className="flex justify-between">
                <div>
                    <p className="font-medium">Sensor Readings</p>
                    <p className="text-xs mb-4 mt-1">Latest reading:{" "} 
                        {reading?.timestamp ? new Date(reading.timestamp).toLocaleString([], {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                        : "No readings available"}</p>
                </div>
                <div className="border py-1 px-2 border-yellow-700 bg-yellow-300/10 w-fit rounded-[10px] mt-2 h-fit">
                    <p className="text-xs text-yellow-700 font-medium">Dry</p>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
                <DetailCard label={"Soil Moisture"} value={`${reading?.soil_moisture}%`} />
                <DetailCard label={"Temperature"} value={`${reading?.temperature}°C`} />
                <DetailCard label={"Rainfall"} value={`${reading?.rainfall} mm`} />
                <DetailCard label={"Sensor Status"} value={reading?.sensor_status} />
            </div>
            <p className="text-xs mt-3">Recommended Water: 500L</p>
            <div className="border p-3 border-red-700 bg-red-300/10 w-full rounded-[10px] mt-4 h-fit">
                <p className="text-sm text-red-700 font-medium">High Temperature</p>
                <p className="text-xs text-red-700 mt-1">Temperature is 36°C, exceeding the 35°C threshold.</p>
            </div>
        </div>
    );
}