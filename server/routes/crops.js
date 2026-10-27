import express from "express"
import { getAllCrops } from "../repositories/cropRepository.js";

export const cropRouter = express.Router();

cropRouter.get("/", (req, res) => {
    try{
        const crops = getAllCrops();
        return res.status(200).json(crops);
    }catch(err){
        return res.status(500).json({ err: err.message })
    }
})