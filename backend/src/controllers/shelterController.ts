import { Request, Response } from "express";
import { ShelterList } from "../models/shelterModel.js";
import mongoose from "mongoose";

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

export const getSheltersWithRatingsAndReviews = async (req: Request, res: Response) => {
  try {
    const sheltersWithStats = await ShelterList.aggregate([
      { $unwind: "$shelters" },
      {
        $lookup: {
          from: "shelterreviews",
          let: { shelter_id: { $toString: "$shelters._id" } },  // Convert _id to string
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$shelter_id", "$$shelter_id"] }
              }
            }
          ],
          as: "reviews"
        }
      },
      {
        $addFields: {
          averageRating: {
            $cond: {
              if: { $eq: [{ $size: "$reviews" }, 0] },
              then: 0,
              else: { $round: [{ $avg: "$reviews.rating" }, 1] }
            }
          },
          reviewCount: { $size: "$reviews" }
        }
      },
      {
        $project: {
          _id: 0,
          shelter: "$shelters",
          averageRating: 1,
          reviewCount: 1
        }
      }
    ]);

    if (!sheltersWithStats || sheltersWithStats.length === 0) {
      return res.json([]);
    }

    res.json(sheltersWithStats);
  } catch (error) {
    console.error('Aggregation error:', error);
    res.status(500).json({ message: error.message });
  }
};
