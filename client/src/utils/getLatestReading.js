export function getLatestReading(cropName, readings) {
    const matchingReadings = readings.filter(
        (reading) => reading.crop_name === cropName
    );

    if (matchingReadings.length === 0) {
        return null;
    }

    return matchingReadings.reduce((latest, reading) => {
        return new Date(reading.timestamp) > new Date(latest.timestamp) ? reading: latest;
    });
}