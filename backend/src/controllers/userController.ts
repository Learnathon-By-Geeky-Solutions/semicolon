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
  
      // Optionally, you could also add the user's ID to the friend's family (if mutual friendship is desired)
      //friend.family.push(user.email);
      //await friend.save();
  
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
    
    if (!userEmail || !friendEmail) {
      return res.status(400).json({ 
        success: false, 
        message: "userEmail and friendEmail are required" 
      });
    }
     
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    const isFriend = user.family.includes(friendEmail);
    res.status(200).json({ 
      success: true, 
      data: { isFriend } 
    });
  } catch (error) {
    console.error("Error checking friendship:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal server error" 
    });
  }
};
  
