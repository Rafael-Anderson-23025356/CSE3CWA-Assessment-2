export function SummaryCard ({ label, value, subtitle }) {
    return (
        <div 
            className="bg-white rounded-[10px] w-full p-4"
            style={{
                fontFamily: "Inter"
            }}
        >
            <p className="text-sm text-gray-500 font-medium">{label}</p>
            <p className="text-[#111320] font-semibold text-2xl mt-3">{value}</p>
            <p className="text-xs mt-3">{subtitle}</p>
        </div>
    );
}