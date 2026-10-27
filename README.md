# SmartFarm Crop Dashboard

A full-stack crop-management dashboard developed for **CSE3CWA / CSE5006 Assessment 2**. The application combines crop configuration records stored in SQLite with simulated IoT sensor readings stored in a JSON file. The React frontend matches the two sources by the exact, case-sensitive `crop_name` and uses the latest timestamp to show each crop's current condition.

## Contents

- `client/` — React frontend built with Vite, React Router, Axios and Tailwind CSS.
- `server/` — Express backend, SQLite database setup, API routes and repositories.
- `server/data/sensor-readings.json` — the simulated, read-only sensor feed.
- `server/smartfarm.db` — SQLite database file in this project copy. The backend creates the table and seeds default records when the table is empty.

## Requirements

- Node.js and npm.
- A modern web browser.

The frontend and backend run as separate development applications.

## Installation and running

### 1. Start the backend

Open a terminal in the project root and run:

```bash
cd server
npm install
```

The server configuration is in `server/.env.example`. Create a `.env` file in `server/` with:

```dotenv
PORT=4000
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm run server
```

The backend URL is **http://localhost:4000**. The API routes are described below. SQLite initialization is performed automatically by `server/db.js` when the backend starts. It creates the `crops` table if it does not exist, then inserts the Tomato, Lettuce and Wheat seed records only if the table is empty. Maize is intentionally not seeded, so it can be created through the application.

### 2. Start the frontend

Open a second terminal in the project root and run:

```bash
cd client
npm install
```

Create `client/.env` using the following value (the same value is in `client/.env.example`):

```dotenv
VITE_API_URL=http://localhost:4000
```

Start the frontend:

```bash
npm run dev
```

Open **http://localhost:5173** in your browser. If you change either port, update the relevant environment values and restart the affected development server. `FRONTEND_URL` must match the frontend origin allowed by the backend CORS configuration.

### Resetting the database

Crop records persist in `server/smartfarm.db`. To test the first-run seed behaviour from a clean state, stop the backend, back up and remove `server/smartfarm.db`, and restart the backend. The database and table will be recreated and the three default crops will be inserted. Do not delete the database if you need to preserve crop records.

## Features

- View Crop Cards and their latest matching sensor reading on the dashboard.
- Create a Crop Card using a crop name available in the sensor feed and not already assigned to a card.
- Edit a crop's location, target moisture range, normal water amount and notes. The crop name is immutable after creation.
- Delete a Crop Card without changing the sensor JSON file.
- Refresh sensor readings from the backend.
- View a crop's sensor history, sorted newest first.
- Calculate crop condition, recommended water, alerts, action and Overall Farm Status in frontend utility functions.

## API reference

Base URL: `http://localhost:4000`

| Method | Endpoint | Purpose | Successful response |
|---|---|---|---|
| `GET` | `/api/crops` | Get all Crop Cards from SQLite. | `200` and a JSON array |
| `GET` | `/api/crops/:id` | Get one Crop Card. | `200` and a JSON object |
| `POST` | `/api/crops` | Create a Crop Card. | `201` and the created object |
| `PUT` | `/api/crops/:id` | Update an existing Crop Card without changing its name. | `200` and the updated object |
| `DELETE` | `/api/crops/:id` | Delete a Crop Card only. | `200` and a deletion result |
| `GET` | `/api/readings` | Read and validate the sensor JSON file. | `200` and a JSON array of readings |

Failed crop API responses use an `error` property, for example:

```json
{"error":"crop_name already exists"}
```

The crop routes use `400` for invalid input, `404` when a Crop Card cannot be found, `409` for a duplicate crop name and `500` for an unexpected server/database failure.

## Data ownership and crop matching

The application has two independent data sources:

- **Crop Cards — SQLite:** stores the farm-managed configuration: `id`, `crop_name`, `location`, `target_min`, `target_max`, `normal_water`, `notes` and `created_at`. Crop Cards can be created, read, updated and deleted through the crop API.
- **Sensor readings — JSON:** `server/data/sensor-readings.json` simulates an external sensor feed. The backend reads this file; crop CRUD operations do not modify it. There are no sensor-reading create, update or delete routes.
- **Dashboard results — React:** crop conditions, water recommendations, alerts, actions and Overall Farm Status are calculated in frontend utilities and are not stored in SQLite.

`crop_name` is the only join key and matching is exact and case-sensitive. For example, `Tomato` matches `Tomato`, but not `tomato`. The Create form's available names are derived from the unique names in the readings minus names already used by existing Crop Cards. Deleting a card makes its crop name available again.

The `getLatestReading(cropName, readings)` utility filters readings using exact `crop_name` equality and selects the reading with the greatest timestamp. It does not assume the final item in the JSON array is the latest. Since the required timestamp format is fixed-width `YYYY-MM-DDTHH:mm:ss`, timestamps in that format can be compared chronologically as strings.

## Dashboard decision rules

The `analyseCrop` utility applies the main conditions in this priority order:

1. **Sensor Problem:** if `sensor_status` is `Offline` or `Faulty`, show `N/A` for recommended water and use the action `Check sensor`. This check takes priority over numeric range checks.
2. **Invalid Data:** for an `Online` reading, soil moisture outside `0–100`, temperature outside `0–50°C`, or rainfall outside `0–50 mm` is invalid. Show `N/A` for recommended water and use `Check reading`.
3. **Dry:** moisture below `target_min`. Recommend the Crop Card's `normal_water` amount and use `Water crop`.
4. **Healthy:** moisture equal to or between `target_min` and `target_max`. Recommend `0` litres and use `Monitor`.
5. **Too Wet:** moisture above `target_max`. Recommend `0` litres and use `Stop watering`.

Additional alerts are calculated for valid `Online` readings only: temperature **greater than 35°C** adds `High Temperature`; rainfall **at least 5 mm** adds `Rain detected`. These alerts do not override the main condition.

The `calculateFarmStatus` utility follows this general priority: `No Crops` if there are no cards; `Critical` if any card has a Sensor Problem or Invalid Data; `Sensor Feed Unavailable` if there is no successful valid online reading; `Watch` if a crop is Dry or Too Wet, or has a High Temperature alert; otherwise `Normal`. Rain detected by itself does not make the overall status `Watch`.

## Sensor JSON: content and validation

The sensor file currently contains 20 readings: five each for Tomato, Lettuce, Wheat and Maize. Every object currently contains the seven expected fields, and the file order is mixed. One older Tomato reading has `soil_moisture: 105`, intended to demonstrate the Invalid Data condition in history. That out-of-range reading should be returned by the sensor endpoint, not rejected merely because its value is outside the normal business range.

### Current validator coverage

The implementation in `server/repositories/readingRepository.js` currently:

- Reads and parses the JSON file each time `GET /api/readings` is requested.
- Checks that the top-level value is an array.
- Checks that each entry is an object with exactly the seven expected fields.
- Checks that `soil_moisture`, `temperature` and `rainfall` are numbers.
- Checks that `sensor_status` is `Online`, `Offline` or `Faulty`.

The validator **does not yet enforce all assignment requirements**. It should additionally validate exactly 20 readings; exactly five readings per allowed crop; allowed and correctly typed `crop_name`; string types for `timestamp` and `notes`; valid calendar timestamps in `YYYY-MM-DDTHH:mm:ss` format; timestamp uniqueness within each crop; and the requirement that exactly one older reading has exactly one out-of-range numeric value. Structural validation failures should return HTTP `500` with `{"error":"Sensor data file is invalid"}`. The current readings route uses the wrong error key (`err`).

### Required latest-reading scenarios

The assignment requires the latest readings to demonstrate these cases with the seeded Crop Card settings:

| Crop | Required latest result | Current sensor data |
|---|---|---|
| Tomato | Online, Dry, temperature above 35°C | Meets the intended scenario |
| Lettuce | Online and Healthy | **Needs correction:** latest moisture is `58.7`, below the seeded target minimum of `60`; change it to a value from `60` to `80`, such as `68.7`, and recheck the file |
| Wheat | Online, Too Wet, rainfall at least 5 mm | Meets the intended scenario |
| Maize | Faulty sensor | Meets the intended scenario; create the Maize Crop Card through the UI to test it |

Before submission, validate the sensor JSON against all the requirements above and test the latest readings by timestamp, not by array position.

## AI-assisted development

**AI tool used:** ChatGPT (OpenAI) was used as a development assistant for understanding requirements, planning and explaining implementation, and helping with code debugging. During the code debugging process, the AI made several mistakes along the way, so I had to correct them at times. I try to review the solution provided, understanding what caused the error and what solved it.

### Sensor-data generation prompt

The following is a concise prompt matching the assignment's sensor-data generation requirements, generated by ChatGPT.

> Generate a valid JSON array containing exactly 20 simulated SmartFarm sensor readings. Use exactly five readings for each crop: Tomato, Lettuce, Wheat and Maize. Every object must contain exactly these fields: crop_name, timestamp, soil_moisture, temperature, rainfall, sensor_status and notes. Use timestamps in YYYY-MM-DDTHH:mm:ss format and ensure timestamps are distinct within each crop. Mix the array order so the latest reading is not always the last object. Use only Online, Offline or Faulty for sensor_status. Keep numeric values within soil moisture 0–100, temperature 0–50 and rainfall 0–50, except for exactly one older reading with exactly one deliberately out-of-range numeric value. That reading must not be the latest for its crop. Ensure the latest Tomato reading is Online, Dry using the default target range, and above 35°C; the latest Lettuce reading is Online and Healthy; the latest Wheat reading is Online, Too Wet and has rainfall of at least 5 mm; and the latest Maize reading has sensor_status Faulty. Return only the JSON array, without Markdown or explanation.

### Checks and correction record

Checks performed on the current file:

- Confirmed that the file parses as JSON and contains 20 readings.
- Confirmed that there are five readings for each of the four crop names.
- Confirmed that the objects contain the seven expected fields.
- Confirmed that one older Tomato reading has an out-of-range soil moisture value of `105`.
- Compared timestamps to identify the latest reading for each crop.

An identified issue to correct is that the latest Lettuce moisture (`58.7`) does not match the required Healthy scenario for its seeded target range (`60–80`). Also, the backend validator does not yet enforce every structural rule listed above. Record the final correction after updating the file and rerunning the checks; do not claim these remaining checks have passed until they have been tested.

### Implementation decision

The application keeps Crop Card configuration in SQLite and sensor observations in a separate read-only JSON file. The frontend joins them using exact `crop_name` matching and calculates the current result from the latest timestamp. This separation prevents crop edits and deletions from changing the simulated external sensor data.

## Known limitations before submission

The Sensor History page currently sorts and displays raw readings; it does not analyse each historical reading with the shared `analyseCrop` utility as required by the brief.