import { Schema, model } from "mongoose";

const ShelterSchema = new Schema({
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },

  district_id: { type: String, required: true, ref: "District" },

  // resources
  food: { type: Number, required: true },
  water: { type: Number, required: true },
  medicine: { type: Number, required: true },
});

const SheltersSchema = new Schema({
  shelters: [ShelterSchema],
});

export const ShelterList = model("Shelters", SheltersSchema);
