import { NextFunction, Request, Response } from "express";

export const test = async (req : Request, res : Response, next: NextFunction) => {
    try {
        res.status(200).json({ success: true, message: "inside authority" });
    } catch (error) {
        console.log("Error inside authority ", error);
        res.status(400).json({ success: false, message: error.message });
    }
    
};
