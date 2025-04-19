import mongoose from "mongoose";

const disasterSchema = new mongoose.Schema({
  type: { type: String, required: true },
  location: {
    lat: Number,
    lng: Number,
  },
  date: Date,
  title: String,
  description: String
});

export const DisasterList = mongoose.model("Disaster", disasterSchema);
