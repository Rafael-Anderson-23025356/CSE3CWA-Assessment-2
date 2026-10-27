import db from "../db.js";

export function getAllCrops() {
  return db.prepare("SELECT * FROM crops").all();
}