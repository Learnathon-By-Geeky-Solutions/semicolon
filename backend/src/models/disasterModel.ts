import mongoose from "mongoose";

const disasterSchema = new mongoose.Schema({
  type: { type: String, required: true },
  location: {
    lat: Number,
    lng: Number,
  },
  frequency: Number,
  date: Date,
});

export const DisasterList = mongoose.model("Disaster", disasterSchema);
