import { InputGroup } from "./InputGroup";

export function CropForm ({isEditing, onSubmit}) {
    return (
        <form 
            className="w-full"
            onSubmit={onSubmit}
        >
            <div className="flex flex-col w-full">
                <p
                    style={{
                        fontFamily: "Inter"
                    }}
                    className="text-2xl font-semibold"
                >{isEditing ? "Edit Crop": "Create Crop"}</p>
                <p className="mt-2 text-sm text-gray-500 mb-6">
                    {isEditing ? "Update the crop's settings below.": "Add a new crop to your farm dashboard."}
                </p>
            </div>
            <InputGroup
                label="Crop Name"
                type="select"
                placeholder="e.g. Maize"
                options={[
                    {
                        label: "Corn",
                        value: "corn"
                    },
                    {
                        label: "Potato",
                        value: "potato"
                    }
                ]}
            />
            <InputGroup
                label="Location"
                marginTop
                type="text"
                placeholder="e.g. South Field"
            />
            <InputGroup
                label="Target Moisture Minimum (%)"
                marginTop
                type="number"
                placeholder="e.g. 50"
            />
            <InputGroup
                label="Target Moisture Maximum (%)"
                marginTop
                type="number"
                placeholder="e.g. 70"
            />
            <InputGroup
                label="Normal Water (L)"
                marginTop
                type="number"
                placeholder="e.g. 600"
            />
            <InputGroup
                label="Notes"
                marginTop
                type="textarea"
                placeholder="Add any notes about this crop (optional)"
            />
            <div className="w-full flex justify-end mt-4">
                <button
                    type="submit"
                    className="cursor-pointer bg-[#111320] rounded-[5px] text-white px-4 py-3 text-sm font-medium w-fit"
                >Add Crop</button>
            </div>
        </form>
    );
}