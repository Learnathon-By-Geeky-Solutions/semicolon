import axios from 'axios';
import { SERVER_URL } from '../constants/paths';
import { Disaster } from '../types/disasterTypes';

const API_URL = `${SERVER_URL}/api/v1/disasters/all`;

export const getDisasters = async ( type?: string): Promise<Disaster[]> => {
  try {
    const response = await axios.get(API_URL + (type && type !== 'all' ? `?type=${encodeURIComponent(type)}` : ''));
    console.log(response?.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching disasters:', error);
    throw new Error('Failed to fetch disasters');
  }
};

export const saveDisasters = async (disasters: Disaster[]): Promise<void> => {
  try {
   const payload = {
    disasters: disasters.map(disaster => ({
      type: disaster.type,
      location: disaster.location,
      frequency: disaster.frequency,
      date: disaster.date,
    }))
   }
    await axios.post(API_URL, payload);
  } catch (error) {
    console.error('Error saving disasters:', error);
  }
};