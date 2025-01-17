import { NextFunction, Request, Response } from "express";
import { hash, compare } from 'bcrypt';
import { User } from "../models/userModel.js";


export const test = async (req : Request, res : Response, next: NextFunction) => {
    try {
        res.status(200).json({ success: true, message: "inside volunteer" });
    } catch (error) {
        console.log("Error inside volunteer ", error);
        res.status(400).json({ success: false, message: error.message });
    }
    
};
