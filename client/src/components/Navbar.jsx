export function Navbar () {
    return (
        <div 
            style={{
                fontFamily: "Inter"
            }}
            className="text-xl p-6 w-full bg-[#F2F1F8] border-b border-gray-600/30 text-[#111320] flex items-center gap-x-3"
        >
            <div className="bg-[#111320] text-white size-8 text-center flex items-center justify-center rounded-[5px]">
                <p>S</p>
            </div>
            <p>
                smartfarm
            </p>
        </div>
    );
}