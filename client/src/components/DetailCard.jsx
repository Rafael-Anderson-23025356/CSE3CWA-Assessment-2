export function DetailCard () {
    return (
        <div
            style={{
                fontFamily: "Inter"
            }}
            className="border border-gray-600/30 p-3 rounded-[10px]"
        >
            <p className="text-xs text-gray-500 font-medium">Soil Moisture</p>
            <p className="font-medium mt-1">40%</p>
        </div>
    );
}