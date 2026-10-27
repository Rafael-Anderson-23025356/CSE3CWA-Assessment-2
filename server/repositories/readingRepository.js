export function getAllReadings() {
  const fileContent = fs.readFileSync(readingsPath, "utf-8");
  const readings = JSON.parse(fileContent);

  if (!Array.isArray(readings)) {
      throw new Error("Sensor readings must be a JSON array.");
  }

  const requiredFields = [
    "crop_name",
    "timestamp",
    "soil_moisture",
    "temperature",
    "rainfall",
    "sensor_status",
    "notes",
  ];

  const validStatuses = ["Online", "Offline", "Faulty"];

  for (const reading of readings) {
      if (
        typeof reading !== "object" ||
        reading === null ||
        Array.isArray(reading)
      ) {
        throw new Error("Each reading must be an object.");
      }

      if (
        Object.keys(reading).length !== requiredFields.length ||
        !requiredFields.every((field) =>
            Object.hasOwn(reading, field)
        )
      ) {
        throw new Error("Invalid sensor reading structure.");
      }

      if (!validStatuses.includes(reading.sensor_status)) {
        throw new Error("Invalid sensor status.");
      }

      if (
        typeof reading.soil_moisture !== "number" ||
        typeof reading.temperature !== "number" ||
        typeof reading.rainfall !== "number"
      ) {
        throw new Error("Sensor values must be numeric.");
      }
  }

  return readings;
}