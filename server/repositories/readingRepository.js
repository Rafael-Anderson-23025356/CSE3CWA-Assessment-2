import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readingsPath = path.join(
    __dirname,
    "../data/sensor-readings.json"
);

export function getAllReadings() {
  const fileContent = fs.readFileSync(readingsPath, "utf-8");
  const readings = JSON.parse(fileContent);

  if (!Array.isArray(readings)) {
    throw new Error("Sensor readings must be a JSON array.");
  }

  return readings;
}