
export function InputGroup({label, placeholder, marginTop, type, options = [], value = "", onChange, disabled}) {
    const inputClassName =
        "w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-[#111320] placeholder:text-gray-400 outline-none transition-colors focus:border-[#111320] focus:ring-2 focus:ring-[#111320]/10 mt-2";
    const disabledClassName =
        "full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-[#111320] placeholder:text-gray-400 outline-none transition-colors focus:border-[#111320] focus:ring-2 focus:ring-[#111320]/10 mt-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 disabled:opacity-70 w-full";

    return (
        <div className={marginTop ? "mt-5" : ""}>
            <p className="font-semibold">{label}</p>

            {type === "textarea" ? (
                <textarea
                    value={value}
                    onChange={(event) => onChange?.(event.target.value)}
                    placeholder={placeholder}
                    className={inputClassName}
                    rows={4}
                />
            ) : type === "select" ? (
                <select
                    value={value}
                    onChange={(event) => onChange?.(event.target.value)}
                    className={disabled ? disabledClassName: inputClassName}
                    disabled={disabled}
                >
                    <option value="" disabled>
                        {placeholder || "Select an option"}
                    </option>

                    {options.map((option) => (
                        <option key={option} value={option}>
                        {option}
                        </option>
                    ))}
                </select>
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={(event) => onChange?.(event.target.value)}
                    placeholder={placeholder}
                    className={inputClassName}
                />
            )}
        </div>
    );
}
