import { Request, Response, NextFunction } from "express";
import {User} from "../models/userModel.js"; // Import the User model

// Controller function to get all users
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Fetch all users from the database
      const users = await User.find(); // Mongoose method to get all users
  
      // Extract the names from the users array
      const userNames = users.map((user: any) => ({
        id: user._id,  // Mongoose returns the _id field by default
        name: user.name,
      }));
  
      // Send the user names in the response
      res.status(200).json({ success: true, data: userNames });
    } catch (error) {
      // Handle any errors
      console.error("Error fetching users:", error);
      res.status(400).json({ success: false, message: error.message });
    }
  };


export const addFriend = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, friendId } = req.body; // Get userId and friendId from the request body

    // Check if both userId and friendId are provided
    if (!userId || !friendId) {
      return res.status(400).json({ success: false, message: "userId and friendId are required" });
    }

    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Find the friend by friendId
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ success: false, message: "Friend not found" });
    }

    // Check if the user is already friends with the friend (to avoid duplicates)
    if (user.family.includes(friendId)) {
      return res.status(400).json({ success: false, message: "Already friends" });
    }

    // Add the friendId to the user's family (friends) array
    user.family.push(friendId);

    // Save the updated user document
    await user.save();

    // Optionally, you could also add the user's ID to the friend's family (if mutual friendship is desired)
    friend.family.push(userId);
    await friend.save();

    // Send the response back with success message
    res.status(200).json({ success: true, message: "Friend added successfully" });
  } catch (error) {
    // Handle any errors
    console.error("Error adding friend:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
