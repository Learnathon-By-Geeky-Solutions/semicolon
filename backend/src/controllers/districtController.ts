import { Request, Response } from "express";
import { District } from "../models/districtModel.js";
import { ShelterList } from "../models/shelterModel.js";

// Get all districts
export const getDistricts = async (req: Request, res: Response) => {
  try {
    const districts = await District.find();
    res.json(districts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDistrictById = async (req: Request, res: Response) => {
  const { _id } = req.body;
  const district = await District.findById(_id);
  res.json(district);
};

// Create a new district
export const createDistrict = async (req: Request, res: Response) => {
  try {
    const { district_name, total_food, total_water, total_medicine } = req.body;

    if (!district_name) {
      return res.status(400).json({
        message: "District name is required",
      });
    }

    const district = new District({
      district_name,
      total_food: total_food || 0,
      total_water: total_water || 0,
      total_medicine: total_medicine || 0,
    });

    const savedDistrict = await district.save();
    res.status(201).json({
      message: "District created successfully",
      data: savedDistrict,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "District name already exists",
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// Update a district
export const updateDistrict = async (req: Request, res: Response) => {
  try {
    const { _id, district_name, total_food, total_water, total_medicine } =
      req.body;

    if (
      !district_name &&
      total_food === undefined &&
      total_water === undefined &&
      total_medicine === undefined
    ) {
      return res.status(400).json({
        message: "At least one field must be provided for update",
      });
    }

    const updateData = {
      ...(district_name && { district_name }),
      ...(total_food !== undefined && { total_food }),
      ...(total_water !== undefined && { total_water }),
      ...(total_medicine !== undefined && { total_medicine }),
    };

    const district = await District.findByIdAndUpdate(_id, updateData, {
      new: true,
    });

    if (!district) {
      return res.status(404).json({ message: "District not found" });
    }

    res.json({
      message: "District updated successfully",
      data: district,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a district
export const deleteDistrict = async (req: Request, res: Response) => {
  try {
    const { _id } = req.body;

    // Check if district has any shelters
    const shelterList = await ShelterList.findOne({
      "shelters.district_id": _id,
    });

    if (shelterList && shelterList.shelters.length > 0) {
      return res.status(400).json({
        message:
          "Cannot delete district that has shelters. Please remove or reassign shelters first.",
      });
    }

    const district = await District.findByIdAndDelete(_id);

    if (!district) {
      return res.status(404).json({ message: "District not found" });
    }

    res.json({
      message: "District deleted successfully",
      data: district,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
