
import { analyseCrop } from "./analyseCrop.js";

export function calculateFarmStatus(cropCards) {
    if (!cropCards || cropCards.length === 0) {
        return {
            status: "No Crops",
            message: "There are no Crop Cards.",
        };
    }

    const hasSuccessfulSensorData = cropCards.some(({ reading }) => {
        if (!reading || ["Offline", "Faulty"].includes(reading.sensor_status)) {
            return false;
        }

        const fields = [
            { value: reading.soil_moisture, min: 0, max: 100 },
            { value: reading.temperature, min: 0, max: 50 },
            { value: reading.rainfall, min: 0, max: 50 },
        ];

        return fields.every(({ value, min, max }) =>
            value !== null &&
            value !== undefined &&
            value !== "" &&
            Number.isFinite(Number(value)) &&
            Number(value) >= min &&
            Number(value) <= max
        );
    });

    if (!hasSuccessfulSensorData) {
        return {
            status: "Sensor Feed Unavailable",
            message: "There is no successful sensor data.",
        };
    }

    const analyses = cropCards.map(({ crop, reading }) =>
        analyseCrop(crop, reading)
    );

    if (
        analyses.some(({ status }) =>
            ["Sensor Problem", "Invalid Data"].includes(status)
        )
    ) {
        return {
            status: "Critical",
            message: "At least one crop has a sensor problem or invalid data.",
        };
    }

    if (
        analyses.some(({ status }) =>
            ["Dry", "Too Wet"].includes(status)
        ) ||
        cropCards.some(
            ({ reading }) => Number(reading.temperature) > 35
        )
    ) {
        return {
            status: "Watch",
            message: "Some crops need attention.",
        };
    }

    return {
        status: "Normal",
        message: "All crops are within acceptable conditions.",
    };
}
