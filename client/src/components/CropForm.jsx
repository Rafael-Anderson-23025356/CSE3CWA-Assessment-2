
import { useState } from "react";
import { InputGroup } from "./InputGroup";
import { useNavigate } from "react-router";

export function CropForm({ isEditing, onSubmit, availableCropNames, crop, error }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        crop_name: crop?.crop_name || "",
        location: crop?.location || "",
        target_min: crop?.target_min || "",
        target_max: crop?.target_max || "",
        normal_water: crop?.normal_water || "",
        notes: crop?.notes || "",
    });

    const handleChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        onSubmit({
            ...formData,
            target_min: formData.target_min === "" ? null : Number(formData.target_min),
            target_max: formData.target_max === "" ? null : Number(formData.target_max),
            normal_water: formData.normal_water === "" ? null : Number(formData.normal_water),
        });
    };

    return (
        <form className="w-full" onSubmit={handleSubmit}>
            <div className="flex flex-col w-full">
                <p
                style={{ fontFamily: "Inter" }}
                className="text-2xl font-semibold"
                >
                    {isEditing ? "Edit Crop" : "Create Crop"}
                </p>

                <p className="mt-2 text-sm text-gray-500 mb-6">
                    {isEditing
                        ? "Update the crop's settings below."
                        : "Add a new crop to your farm dashboard."}
                </p>
            </div>

            <InputGroup
                label="Crop Name"
                type="select"
                placeholder="e.g. Maize"
                options={
                    isEditing && crop?.crop_name &&
                    !availableCropNames.includes(crop.crop_name)
                        ? [crop.crop_name, ...availableCropNames]
                        : availableCropNames
                }
                value={formData.crop_name}
                onChange={(value) => handleChange("crop_name", value)}
                disabled={isEditing}
            />

            <InputGroup
                label="Location"
                marginTop
                type="text"
                placeholder="e.g. South Field"
                value={formData.location}
                onChange={(value) => handleChange("location", value)}
            />

            <InputGroup
                label="Target Moisture Minimum (%)"
                marginTop
                type="number"
                placeholder="e.g. 50"
                value={formData.target_min}
                onChange={(value) => handleChange("target_min", value)}
            />

            <InputGroup
                label="Target Moisture Maximum (%)"
                marginTop
                type="number"
                placeholder="e.g. 70"
                value={formData.target_max}
                onChange={(value) => handleChange("target_max", value)}
            />

            <InputGroup
                label="Normal Water (L)"
                marginTop
                type="number"
                placeholder="e.g. 600"
                value={formData.normal_water}
                onChange={(value) => handleChange("normal_water", value)}
            />

            <InputGroup
                label="Notes"
                marginTop
                type="textarea"
                placeholder="Add any notes about this crop (optional)"
                value={formData.notes}
                onChange={(value) => handleChange("notes", value)}
            />
            {error && (
                <p className="mb-4 text-sm text-red-600 mt-1">{error}</p>
            )}

            <div className="w-full flex justify-end mt-4">
                <button 
                    type="button"
                    className="cursor-pointer rounded-[5px] px-4 py-3 border border-[#111320] bg-white text-sm"
                    onClick={() => {
                        navigate("/");
                    }}
                >Cancel</button>
                <button
                type="submit"
                className="cursor-pointer bg-[#111320] rounded-[5px] text-white px-4 py-3 text-sm font-medium w-fit ml-2"
                >
                    {isEditing ? "Save Changes" : "Add Crop"}
                </button>
            </div>
        </form>
    );
}
