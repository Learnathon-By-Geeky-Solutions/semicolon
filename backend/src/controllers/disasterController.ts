import { Request, Response } from "express";
import { DisasterList } from "../models/disasterModel.js";

export const getDisasters = async (req: Request, res: Response) => {
    try {
        const filter: { type?: { $eq: string } } = {};
        if (typeof req.query.type === 'string' && req.query.type !== 'all') {
          filter.type = { $eq: req.query.type };
        }
        const disasters = await DisasterList.find(filter);

        if (!disasters || disasters.length === 0) {
          return res.status(404).json({ message: "No disasters found" });
        }

        console.log(disasters);
        res.json(disasters);
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