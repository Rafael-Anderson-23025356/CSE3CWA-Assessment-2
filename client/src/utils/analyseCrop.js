export function analyseCrop(cropCard, reading) {
    const noWater = "N/A";

    if (!reading) {
        return {
            status: "Invalid Data",
            recommendedWater: noWater,
            action: "Check reading",
            alerts: [
                {
                    title: "Missing Reading",
                    message: "No sensor reading is available for this crop.",
                    severity: "danger",
                },
            ],
        };
    }

    if (["Offline", "Faulty"].includes(reading.sensor_status)) {
        return {
            status: "Sensor Problem",
            recommendedWater: noWater,
            action: "Check sensor",
            alerts: [
                {
                    title: "Sensor Problem",
                    message: `Sensor status: ${reading.sensor_status}.`,
                    severity: "danger",
                },
            ],
        };
    }

    const invalidFields = [];

    const moisture = Number(reading.soil_moisture);
    const temperature = Number(reading.temperature);
    const rainfall = Number(reading.rainfall);

    if (
        reading.soil_moisture == null ||
        reading.soil_moisture === "" ||
        !Number.isFinite(moisture) ||
        moisture < 0 ||
        moisture > 100
    ) {
        invalidFields.push("Soil moisture");
    }

    if (
        reading.temperature == null ||
        reading.temperature === "" ||
        !Number.isFinite(temperature) ||
        temperature < 0 ||
        temperature > 50
    ) {
        invalidFields.push("Temperature");
    }

    if (
        reading.rainfall == null ||
        reading.rainfall === "" ||
        !Number.isFinite(rainfall) ||
        rainfall < 0 ||
        rainfall > 50
    ) {
        invalidFields.push("Rainfall");
    }

    if (invalidFields.length > 0) {
        return {
            status: "Invalid Data",
            recommendedWater: noWater,
            action: "Check reading",
            alerts: [
                {
                    title: "Invalid Data",
                    message: `Invalid field(s): ${invalidFields.join(", ")}.`,
                    severity: "danger",
                },
            ],
        };
    }

    const alerts = [];

    if (temperature > 35) {
        alerts.push({
            title: "High Temperature",
            message: `Temperature is ${temperature}°C, above 35°C.`,
            severity: "warning",
        });
    }

    if (rainfall >= 5) {
        alerts.push({
            title: "Rain detected",
            message: `Rainfall is ${rainfall} mm.`,
            severity: "warning",
        });
    }

    if (moisture < Number(cropCard.target_min)) {
        return {
            status: "Dry",
            recommendedWater: cropCard.normal_water,
            action: "Water crop",
            alerts: [
                ...alerts,
                {
                    title: "Low Soil Moisture",
                    message: `Soil moisture is ${moisture}%, below the target minimum of ${cropCard.target_min}%.`,
                    severity: "warning",
                },
            ],
        };
    }

    if (moisture <= Number(cropCard.target_max)) {
        return {
            status: "Healthy",
            recommendedWater: 0,
            action: "Monitor",
            alerts,
        };
    }

    return {
        status: "Too Wet",
        recommendedWater: 0,
        action: "Stop watering",
        alerts: [
            ...alerts,
            {
                title: "High Soil Moisture",
                message: `Soil moisture is ${moisture}%, above the target maximum of ${cropCard.target_max}%.`,
                severity: "warning",
            },
        ],
    };
}