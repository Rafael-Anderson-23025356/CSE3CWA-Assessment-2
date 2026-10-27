export function DetailCard ({label, value}) {
    return (
        <div
            style={{
                fontFamily: "Inter"
            }}
            className="border border-gray-600/30 p-3 rounded-[10px]"
        >
            <p className="text-xs text-gray-500 font-medium">{label}</p>
            <p className="font-medium mt-1">{value}</p>
        </div>
    );
}