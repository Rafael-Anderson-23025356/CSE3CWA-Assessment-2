export function getAvailableCropNames(readings, crops) {
  const usedCropNames = new Set(
    crops.map((crop) => crop.crop_name)
  );

  return [...new Set(readings.map((reading) => reading.crop_name))]
    .filter((cropName) => !usedCropNames.has(cropName));
}