import db from "../db.js";

export function getAllCrops() {
    return db.prepare("SELECT * FROM crops").all();
}

export function deleteCropById(id) {
  return db.prepare("DELETE FROM crops WHERE id = ?").run(id);
}

export function getCropById(id) {
  return db.prepare("SELECT * FROM crops WHERE id = ?").get(id);
}

export function createCrop(crop) {
  const {
    crop_name,
    location,
    target_min,
    target_max,
    normal_water,
    notes,
  } = crop;

  const cropNames = {
    tomato: "Tomato",
    lettuce: "Lettuce",
    wheat: "Wheat",
    maize: "Maize",
  };

  const normalizedCropName = cropNames[crop_name?.trim().toLowerCase()];

  if (!normalizedCropName) {
    throw new Error("Invalid crop name.");
  }

  const result = db.prepare(`
    INSERT INTO crops (
      crop_name, location, target_min, target_max, normal_water, notes
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    normalizedCropName,
    location,
    target_min,
    target_max,
    normal_water,
    notes ?? ""
  );

  return db.prepare("SELECT * FROM crops WHERE id = ?")
    .get(result.lastInsertRowid);
}

export function updateCropById(id, crop) {
  const {
    location,
    target_min,
    target_max,
    normal_water,
    notes,
  } = crop;

  const result = db.prepare(`
    UPDATE crops
    SET location = ?, target_min = ?, target_max = ?, normal_water = ?, notes = ?
    WHERE id = ?
  `).run(location, target_min, target_max, normal_water, notes ?? "", id);

  if (result.changes === 0) {
    return null;
  }

  return getCropById(id);
}