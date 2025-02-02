import axios from 'axios';
import { SERVER_URL } from '../constants/paths';
import { District, NewDistrict } from '../types/districtTypes';

const API_URL = `${SERVER_URL}/api/v1/district`;

export const getDistricts = async (): Promise<District[]> => {
  try {
    const url = `${API_URL}/all`
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching districts:', error);
    return [];
  }
};

export const createDistrict = async (district: NewDistrict): Promise<void> => {
  try {
    const url = `${API_URL}/create`
    await axios.post(url, district);
  } catch (error) {
    console.error('Error saving district:', error);
  }
};

export const updateDistrict = async (district: District): Promise<void> => {
    try {
      const url = `${API_URL}/update`
      await axios.post(url, district);
    } catch (error) {
      console.error('Error updating district:', error);
    }
};


export const deleteDistrict = async (district: District): Promise<void> => {
    try {
      const url = `${API_URL}/delete`
      await axios.post(url, district);
    } catch (error) {
      console.error('Error deleting district:', error);
    }
};

export const getDistrictById = async (id: string): Promise<District> => {
  const url = `${API_URL}/getDistrictById`
  const response = await axios.post(url, { _id: id });
  return response.data;
};
