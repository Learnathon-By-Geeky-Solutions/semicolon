import { Schema, model } from 'mongoose';

const DistrictSchema = new Schema({
//   district_id: { type: String, required: true, unique: true },  
  district_name: { type: String, required: true, unique: true },  // District Name

  // Resources for the district
  total_food: { type: Number, required: true, default: 0 },
  total_water: { type: Number, required: true, default: 0 },
  total_medicine: { type: Number, required: true, default: 0 },
});

export const District = model('District', DistrictSchema);
