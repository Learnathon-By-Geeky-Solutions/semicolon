import { Request, Response } from "express";
import { DisasterList } from "../models/disasterModel.js";

export const getDisasters = async (req: Request, res: Response) => {
    try {
        const filter: { type?: string } = {};
        if (req.query.type && req.query.type !== 'all') {
          filter.type = req.query.type as string;
        }
        const disasters = await DisasterList.find(filter);

        if (!disasters || disasters.length === 0) {
          return res.status(404).json({ message: "No disasters found" });
        }
        
        console.log(disasters[0]?.disasters);
        res.json(disasters[0].disasters);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
};

export const saveDisasters = async (req: Request, res: Response) => {
    try {
        const { type, location, frequency, date } = req.body;
        const newDisaster = new DisasterList({ type, location, frequency, date });
        const savedDisaster = await newDisaster.save();
        res.status(201).json(savedDisaster);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
};