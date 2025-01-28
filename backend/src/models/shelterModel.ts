import { Schema, model } from 'mongoose';

const ShelterSchema = new Schema({
  name: { type: String, required: true },
  lat: { type: Number, required: true, unique:true },
  lng: { type: Number, required: true, unique: true },
  district_id: { type: String, required: true },
  district_name: { type: String, required: false },

  // resources
  food: { type: Number, required: true },
  water: { type: Number, required: true },
  medicine: { type: Number, required: true },

});

const SheltersSchema = new Schema({
    shelters: [ShelterSchema]
});

export const ShelterList = model('Shelters', SheltersSchema);