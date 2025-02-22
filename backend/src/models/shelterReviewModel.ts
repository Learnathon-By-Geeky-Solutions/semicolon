import { Schema, model } from "mongoose";

const ShelterReviewSchema = new Schema({
  shelter_id: { type: String, required: true, ref: "Shelter" },
  user_id: { type: String, required: true, ref: "User" },
  rating: { type: Number, required: true },
  review: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


export const ShelterReview = model("ShelterReviews", ShelterReviewSchema);
