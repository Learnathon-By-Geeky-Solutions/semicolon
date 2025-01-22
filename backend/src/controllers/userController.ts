import { Request, Response, NextFunction } from "express";
import {User} from "../models/userModel.js"; // Import the User model

// Controller function to get all users
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Fetch all users from the database
      const users = await User.find(); // Mongoose method to get all users
  
      // Extract the names from the users array
      const userNames = users.map((user: any) => user.name);
  
      // Send the user names in the response
      res.status(200).json({ success: true, data: userNames });
    } catch (error) {
      // Handle any errors
      console.error("Error fetching users:", error);
      res.status(400).json({ success: false, message: error.message });
    }
  };