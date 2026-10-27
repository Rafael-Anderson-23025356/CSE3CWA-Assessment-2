export function HistoryEntry({ reading }) {
    return (
        <div 
            className="rounded-xl border border-gray-200 bg-white p-5"
            style={{
                fontFamily: "Inter"
            }}
        >
            <p className="text-sm text-gray-500">
                {reading?.timestamp ? new Date(reading.timestamp).toLocaleString([], {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }): (
                    <p className="rounded-lg bg-white p-6 text-center text-sm text-gray-500">
                    No sensor history available for this crop.
                    </p>
                )}
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 md:grid-cols-4">
                <div className="border border-gray-600/30 p-3 rounded-[10px]">
                    <p className="text-sm text-gray-500 font-medium">Soil Moisture</p>
                    <p className="font-medium mt-1 text-lg">{`${reading.soil_moisture}%`}</p>
                </div>

                <div className="border border-gray-600/30 p-3 rounded-[10px]">
                    <p className="text-sm text-gray-500 font-medium">Temperature</p>
                    <p className="font-medium mt-1 text-lg">{`${reading?.temperature}°C`}</p>
                </div>

                <div className="border border-gray-600/30 p-3 rounded-[10px]">
                    <p className="text-sm text-gray-500 font-medium">Rainfall</p>
                    <p className="font-medium mt-1 text-lg">{`${reading?.rainfall} mm`}</p>
                </div>

                <div className="border border-gray-600/30 p-3 rounded-[10px]">
                    <p className="text-sm text-gray-500 font-medium">Sensor Status</p>
                    <p className="font-medium mt-1 text-lg">{reading.sensor_status}</p>
                </div>
            </div>

            {reading.notes && (
                <p className="mt-4 border-t border-gray-100 pt-3 text-sm text-gray-600">
                    {reading.notes}
                </p>
            )}
        </div>
    );
}