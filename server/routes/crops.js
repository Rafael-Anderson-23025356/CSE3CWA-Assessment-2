import express from "express"
import { getAllCrops, deleteCropById, createCrop, getCropById, updateCropById } from "../repositories/cropRepository.js";

export const cropRouter = express.Router();

cropRouter.get("/", (req, res) => {
    try{
        const crops = getAllCrops();
        return res.status(200).json(crops);
    }catch(err){
        return res.status(500).json({ err: err.message })
    }
})

cropRouter.get("/:id", (req, res) => {
    try {
        const id = Number(req.params.id);
        const crop = getCropById(id);

        if (!crop) {
            return res.status(404).json({
                error: "Crop not found.",
            });
        }

        return res.status(200).json(crop);
    } catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
});
cropRouter.post("/", (req, res) => {
  try {
    const crop = createCrop(req.body);

    return res.status(201).json(crop);
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        error: "A Crop Card for this crop already exists.",
      });
    }

    return res.status(500).json({ error: err.message });
  }
});

cropRouter.put("/:id", (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: "Invalid crop ID." });
    }

    const existingCrop = getCropById(id);

    if (!existingCrop) {
      return res.status(404).json({ error: "Crop not found." });
    }

    const updatedCrop = updateCropById(id, req.body);

    return res.status(200).json(updatedCrop);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

cropRouter.delete("/:id", (req, res) => {
    try{
        const { id } = req.params;
        const result = deleteCropById(id);

        if (result.changes === 0) {
        return res.status(404).json({ error: "Crop not found." });
        }

        return res.status(200).json({
            message: "Crop deleted successfully.",
        });
    }catch(err){
        return res.status(500).json({ err: err.message })
    }
})