import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

const API_BASE_URL = process.env.SERVER_URL;

export const signupUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "authority" | "volunteer";
  document?: string; 
}) => {
  const res = await axios.post(`${API_BASE_URL}/user/signup`, userData, {
    headers: { "Content-Type": "application/json" },
  });

  if (res.status !== 201) {
    throw new Error("Unable to Signup");
  }

  return res.data;
};
