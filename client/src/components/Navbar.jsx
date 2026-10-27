export function Navbar () {
    return (
        <div 
            style={{
                fontFamily: "Inter"
            }}
            className="text-xl px-8 py-6 w-full bg-[#F2F1F8] border-b border-gray-600/30 text-[#111320] flex items-center gap-x-3 sticky top-0 z-[999]"
        >
            <div 
                className="bg-[#111320] text-white size-8 text-center flex items-center justify-center rounded-[5px] cursor-pointer"
                title="smartfarm"
            >
                <p>S</p>
            </div>
            <p>
                smartfarm
            </p>
        </div>
    );
}