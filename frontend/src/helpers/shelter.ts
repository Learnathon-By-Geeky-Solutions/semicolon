import axios from 'axios';
import { SERVER_URL } from '../constants/paths';
import { Shelter } from '../types/shelterMapTypes';

const API_URL = `${SERVER_URL}/api/v1/shelters/all`;

export const getShelters = async (): Promise<Shelter[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching shelters:', error);
    return [];
  }
};

export const saveShelters = async (shelters: Shelter[]): Promise<void> => {
  try {
   const payload = {
    shelters: shelters
   }
    await axios.post(API_URL, payload);
  } catch (error) {
    console.error('Error saving shelters:', error);
  }
};