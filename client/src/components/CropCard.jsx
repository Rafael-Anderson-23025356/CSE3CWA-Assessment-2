import { DetailCard } from "./DetailCard";
import { HiDotsVertical } from "react-icons/hi";
import { useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export function CropCard ({crop}) {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <div className="p-4 bg-white rounded-[10px]">
            <div className="flex justify-between items-center">
                <div className="flex-1">
                    <p className="text-xl font-medium">{crop.crop_name}</p>
                </div>
                <div className="relative h-fit w-fit">
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
                                }}
                                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                            >
                                <FiEdit2 size={15} />
                                Edit
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setMenuOpen(false);
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
            <span className="text-sm mt-2 flex justify-between">
                <p className="font-medium">Location:</p> 
                <p>{crop.location}</p>
            </span>
            <span className="text-sm mt-1 flex justify-between">
                <p className="font-medium">Target Moisture:</p> 
                <p>{crop.target_min}-{crop.target_max}%</p>
            </span>
            <span className="text-sm mt-1 flex justify-between">
                <p className="font-medium">Normal Water:</p> 
                <p>{crop.normal_water}L</p>
            </span>
            <span className="text-sm mt-1 flex flex-col">
                <p className="font-medium">Notes:</p> 
                <p>{crop?.notes ?? "-"}</p>
            </span>
            <div className="bg-gray-600/30 h-[0.1px] my-4"></div>
            <div className="flex justify-between">
                <div>
                    <p className="font-medium">Sensor Readings</p>
                    <p className="text-xs mb-4 mt-1">Latest reading: 26 Oct 2026, 10:35 AM</p>
                </div>
                <div className="border py-1 px-2 border-yellow-700 bg-yellow-300/10 w-fit rounded-[10px] mt-2 h-fit">
                    <p className="text-xs text-yellow-700 font-medium">Dry</p>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <DetailCard />
                <DetailCard />
                <DetailCard />
                <DetailCard />
            </div>
            <p className="text-xs mt-3">Recommended Water: 500L</p>
            <div className="border p-3 border-red-700 bg-red-300/10 w-full rounded-[10px] mt-4 h-fit">
                <p className="text-sm text-red-700 font-medium">High Temperature</p>
                <p className="text-xs text-red-700 mt-1">Temperature is 36°C, exceeding the 35°C threshold.</p>
            </div>
            <button
                type="button"
                className="cursor-pointer bg-[#111320] font-medium rounded-[5px] text-white px-4 py-3 text-sm w-full mt-6   "
            >View History</button>
        </div>
    );
}