import express from "express"
import { getAllReadings, } from "../repositories/readingRepository.js";

export const readingRouter = express.Router();

readingRouter.get("/", (req, res) => {
    try{
        const readings = getAllReadings();
        return res.status(200).json(readings);
    }catch(err){
        return res.status(500).json({ err: err.message });
    }
})