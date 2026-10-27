export function InputGroup ({ label, placeholder, marginTop, type, options }) {
    return (
        <div className={`${marginTop && "mt-5"}`}>
            <p className="font-semibold">{label}</p>
            {type === "textarea" ? (
                <textarea
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-[#111320] placeholder:text-gray-400 outline-none transition-colors focus:border-[#111320] focus:ring-2 focus:ring-[#111320]/10 mt-2"
                    rows={4}
                />
            ) : type === "select" ? (
                <select
                    defaultValue={""}
                    className={`w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-[#111320] placeholder:text-gray-400 outline-none transition-colors focus:border-[#111320] focus:ring-2 focus:ring-[#111320]/10 mt-2`}
                >
                    <option value="" disabled>
                        {placeholder || "Select an option"}
                    </option>

                    {options.map((option) => (
                        <option key={option.value} value={option.value} className="text-[#111320]">
                            {option.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-[#111320] placeholder:text-gray-400 outline-none transition-colors focus:border-[#111320] focus:ring-2 focus:ring-[#111320]/10 mt-2"
                />
            )}
        </div>
    );
}