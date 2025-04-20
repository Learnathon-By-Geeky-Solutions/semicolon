import { Request, Response, NextFunction } from "express";
import {User} from "../models/userModel.js"; // Import the User model

// Controller function to get all users
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Fetch all users from the database
      const users = await User.find(); // Mongoose method to get all users
  
      // Extract the names from the users array
      const userNames = users.map((user: any) => ({
        email: user.email,  // Mongoose returns the _id field by default
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
      const { userEmail, friendEmail } = req.body; // Get userEmail and friendEmail from the request body
      console.log(userEmail+"jdsfni");
      // Check if both userEmail and friendEmail are provided
      if (!userEmail || !friendEmail) {
        return res.status(400).json({ success: false, message: "userEmail and friendEmail are required" });
      }
  
      // Find the user by userEmail
      const user = await User.findOne({ email: userEmail });  // Using findOne to search by email
      if (!user) {
        console.log("User not found");
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      // Find the friend by friendEmail
      const friend = await User.findOne({ email: friendEmail });  // Using findOne to search by email
      if (!friend) {
        return res.status(404).json({ success: false, message: "Friend not found" });
      }
  
      // Check if the user is already friends with the friend (to avoid duplicates)
      if (user.family.includes(friend.email)) {
        return res.status(400).json({ success: false, message: "Already friends" });
      }
  
      // Add the friendId to the user's family (friends) array
      user.family.push(friend.email);
  
      // Save the updated user document
      await user.save();
  
  
      // Send the response back with success message
      res.status(200).json({ success: true, message: "Friend added successfully" });
    } catch (error) {
      // Handle any errors
      console.error("Error adding friend:", error);
      res.status(400).json({ success: false, message: error.message +"in add d=" });
    }
  };
  
export const checkFriendship = async (req: Request, res: Response) => {
  try {
    const { userEmail, friendEmail } = req.body;
    
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFriend = user.family.includes(friendEmail);
    res.json({ isFriend });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteFriend = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userEmail, friendEmail } = req.body; // Get userEmail and friendEmail from the request body

    // Check if both userEmail and friendEmail are provided
    if (!userEmail || !friendEmail) {
      return res.status(400).json({ success: false, message: "userEmail and friendEmail are required" });
    }

    // Find the user by userEmail
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Find the friend by friendEmail
    const friend = await User.findOne({ email: friendEmail });
    if (!friend) {
      return res.status(404).json({ success: false, message: "Friend not found" });
    }

    // Check if the friend is actually in the user's family list
    if (!user.family.includes(friend.email)) {
      return res.status(400).json({ success: false, message: "This user is not in your friend list" });
    }

    // Remove the friend from the user's family list
    user.family = user.family.filter(email => email !== friend.email);

    // Save the updated user document
    await user.save();

    // Optionally, if mutual friendship should be removed, remove the user from the friend's family list as well
    // friend.family = friend.family.filter(email => email !== user.email);
    // await friend.save();

    // Send the response back with success message
    res.status(200).json({ success: true, message: "Friend removed successfully" });
  } catch (error) {
    // Handle any errors
    console.error("Error removing friend:", error);
    res.status(500).json({ success: false, message: "An error occurred while removing friend" });
  }
};

  
