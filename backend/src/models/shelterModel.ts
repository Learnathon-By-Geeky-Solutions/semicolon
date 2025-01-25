import { Schema, model } from 'mongoose';

const ShelterSchema = new Schema({
  name: { type: String, required: true },
  lat: { type: String, required: true, unique:true },
  lng: { type: String, required: true, unique: true }

});

const SheltersSchema = new Schema({
    id: { type: String, unique:true },
    shelters: [ShelterSchema]
});

export const ShelterList = model('Shelter', SheltersSchema);