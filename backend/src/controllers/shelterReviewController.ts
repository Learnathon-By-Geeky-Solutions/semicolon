import { Request, Response } from "express";
import { ShelterReview } from "../models/shelterReviewModel.js";

// Get all reviews
export const getReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await ShelterReview.find();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getReviewsByShelterId = async (req: Request, res: Response) => {
  try {
    const { shelter_id } = req.body;
    if (typeof shelter_id !== "string") {
      return res.status(400).json({ message: "Invalid shelter ID" });
    }
    const reviews = await ShelterReview.find({ shelter_id });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new review
export const createReview = async (req: Request, res: Response) => {
  try {
    const { shelter_id, user_id, rating, review } = req.body;

    if (!shelter_id || !user_id || !rating) {
      return res.status(400).json({
        message: "Shelter ID, User ID, and Rating are required",
      });
    }

    const newReview = new ShelterReview({
      shelter_id: shelter_id.trim().replace(/[<>]/g, ""),
      user_id: user_id.trim().replace(/[<>]/g, ""),
      rating: rating || 0,
      review: review || "",
    });

    const savedReview = await newReview.save();
    res.status(201).json({
      message: "Review created successfully",
      data: savedReview,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Review already exists",
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// Update a review
export const updateReview = async (req: Request, res: Response) => {
  try {
    const { _id, shelter_id, user_id, rating, review } = req.body;
      req.body;

    if (
      !shelter_id &&
      !user_id &&
      rating === undefined &&
      review === undefined
    ) {
      return res.status(400).json({
        message: "At least one field must be provided for update",
      });
    }

    const updateData = {
      ...(shelter_id && { shelter_id }),
      ...(user_id !== undefined && { user_id }),
      ...(rating !== undefined && { rating }),
      ...(review !== undefined && { review }),
    };

    const newReview = await ShelterReview.findByIdAndUpdate(
      _id,
      updateData,
      {
        new: true,
      },
    );

    if (!newReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({
      message: "Review updated successfully",
      data: newReview,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a review
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { _id } = req.body

    const review = await ShelterReview.findByIdAndDelete(_id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({
      message: "Review deleted successfully",
      data: review,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get review by user ID and shelter ID
export const getReviewByUserAndShelter = async (req: Request, res: Response) => {
  try {
    const { userId, shelterId } = req.params;

    const review = await ShelterReview.findOne({
      user_id: userId,
      shelter_id: shelterId
    });

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get average rating for a shelter
export const getAverageRating = async (req: Request, res: Response) => {
  try {
    const { shelterId } = req.params;

    const reviews = await ShelterReview.find({ shelter_id: shelterId });

    if (!reviews || reviews.length === 0) {
      return res.json({
        averageRating: 0,
        reviewCount: 0
      });
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    res.json({
      averageRating,
      reviewCount: reviews.length
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



