import { Schema, model } from "mongoose";

const DisasterSchema = new Schema({
  type: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  frequency: { type: Number, default: 1 },
  date: { type: Date, default: Date.now }
});

const DisastersSchema = new Schema({
  disasters: [DisasterSchema],
});

export const DisasterList = model("Disasters", DisastersSchema);

