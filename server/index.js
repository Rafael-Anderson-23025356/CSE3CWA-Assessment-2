import express from "express"
import db from "./db.js"
import { cropRouter } from "./routes/crops.js"
import "dotenv/config";
import cors from "cors"

const server = express();
const port = process.env.PORT || 4000;

server.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);

server.listen(port, () => {
    console.log("Server is running in port 4000.")
})

server.use("/api/crops", cropRouter);