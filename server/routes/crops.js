import express from "express";
import {getAllCrops, deleteCropById, createCrop, getCropById, updateCropById} from "../repositories/cropRepository.js";
import { getAllReadings } from "../repositories/readingRepository.js";

export const cropRouter = express.Router();

const requiredFields = [
  "crop_name",
  "location",
  "target_min",
  "target_max",
  "normal_water",
];

const numericFields = [
  "target_min",
  "target_max",
  "normal_water",
];

function validateCropBody(body, res) {
  for (const field of requiredFields) {
    if (
      body[field] === undefined ||
      body[field] === null ||
      body[field] === ""
    ) {
      res.status(400).json({
          error: `${field} is required`,
      });
      return false;
    }
  }

  if (typeof body.crop_name !== "string" || !body.crop_name.trim()) {
    res.status(400).json({ error: "crop_name is invalid" });
    return false;
  }

  if (typeof body.location !== "string" || !body.location.trim()) {
    res.status(400).json({ error: "location is invalid" });
    return false;
  }

  if (body.location.length > 100) {
    res.status(400).json({ error: "location is invalid" });
    return false;
  }

  for (const field of numericFields) {
    if (
      typeof body[field] !== "number" ||
      !Number.isFinite(body[field])
    ) {
      res.status(400).json({ error: `${field} is invalid` });
      return false;
    }
  }

  if (
    body.target_min < 0 ||
    body.target_min > 100 ||
    body.target_max < 0 ||
    body.target_max > 100 ||
    body.target_min >= body.target_max
  ) {
    res.status(400).json({ error: "target_min or target_max is invalid" });
    return false;
  }

  if (body.normal_water <= 0 || body.normal_water > 10000) {
    res.status(400).json({ error: "normal_water is invalid" });
    return false;
  }

  return true;
}

function getSensorCropNames() {
  try {
    const readings = getAllReadings();

    if (
      !Array.isArray(readings) ||
      readings.some(
        (reading) =>
          !reading ||
          typeof reading.crop_name !== "string" ||
          !reading.crop_name.trim()
      )
    ) {
      throw new Error("Invalid sensor data structure");
    }

    return new Set(readings.map((reading) => reading.crop_name));
  } catch {
    const error = new Error("Sensor data file is invalid");
    error.code = "SENSOR_DATA_INVALID";
    throw error;
  }
}

function handleError(res, err) {
  if (err.code === "SENSOR_DATA_INVALID") {
    return res.status(500).json({
      error: "Sensor data file is invalid",
    });
  }

  if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
    return res.status(409).json({
      error: "crop_name already exists",
    });
  }

  return res.status(500).json({
    error: "Internal server error",
  });
}

cropRouter.get("/", (req, res) => {
  try {
    return res.status(200).json(getAllCrops());
  } catch (err) {
    return handleError(res, err);
  }
});

cropRouter.get("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(404).json({
          error: "Crop card not found",
        });
    }

    const crop = getCropById(id);

    if (!crop) {
        return res.status(404).json({
          error: "Crop card not found",
        });
    }

    return res.status(200).json(crop);
  } catch (err) {
    return handleError(res, err);
  }
});

cropRouter.post("/", (req, res) => {
  try {
    if (!validateCropBody(req.body, res)) {
        return;
    }

    const sensorCropNames = getSensorCropNames();

    if (!sensorCropNames.has(req.body.crop_name)) {
        return res.status(400).json({
          error: "crop_name does not exist in sensor data",
        });
    }

    const crop = createCrop(req.body);

    return res.status(201).json(crop);
  } catch (err) {
    return handleError(res, err);
  }
});

cropRouter.put("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(404).json({
        error: "Crop card not found",
      });
    }

    const existingCrop = getCropById(id);

    if (!existingCrop) {
      return res.status(404).json({
        error: "Crop card not found",
      });
    }

    if (req.body.crop_name !== existingCrop.crop_name) {
      return res.status(400).json({
        error: "crop_name cannot be changed",
      });
    }

    if (!validateCropBody(req.body, res)) {
      return;
    }

    const sensorCropNames = getSensorCropNames();

    if (!sensorCropNames.has(req.body.crop_name)) {
      return res.status(400).json({
        error: "crop_name does not exist in sensor data",
      });
    }

    const updatedCrop = updateCropById(id, req.body);

    if (!updatedCrop) {
      return res.status(404).json({
        error: "Crop card not found",
      });
    }

    return res.status(200).json(updatedCrop);
  } catch (err) {
    return handleError(res, err);
  }
});

cropRouter.delete("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(404).json({
        error: "Crop card not found",
      });
    }

    const crop = getCropById(id);

    if (!crop) {
      return res.status(404).json({
        error: "Crop card not found",
      });
    }

    deleteCropById(id);

    return res.status(200).json({
      deleted: true,
      id,
    });
  } catch (err) {
      return handleError(res, err);
  }
});