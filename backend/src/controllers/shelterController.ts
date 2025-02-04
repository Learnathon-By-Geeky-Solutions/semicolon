import { Request, Response } from "express";
import { ShelterList } from "../models/shelterModel.js";

export const getShelters = async (req: Request, res: Response) => {
  try {
    const shelterList = await ShelterList.findOne();
    if (shelterList) {
      res.json(shelterList.shelters);
    } else {
      res.json([]);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const saveShelters = async (req: Request, res: Response) => {
  try {
    const { shelters } = req.body;
    if (!Array.isArray(shelters)) {
      return res.status(400).json({ message: "Shelters must be an array" });
    }

    const shelterList = await ShelterList.findOneAndUpdate(
      {},
      { shelters },
      { upsert: true, new: true },
    );

    res.status(201).json({
      message: "Shelters saved successfully",
      data: shelterList.shelters,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
