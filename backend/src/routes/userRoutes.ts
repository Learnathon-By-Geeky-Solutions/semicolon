import express  from "express";
import { addFriend, getAllUsers, checkFriendship,deleteFriend } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authenticationMiddleware.js"; // Assuming the middleware is correctly set up
import { authorizeRole } from "../middlewares/roleMiddleware.js";
import rateLimit from "express-rate-limit";

const userRouter = express.Router();

// Configure rate limiter: maximum of 100 requests per 15 minutes
const deleteFriendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later.",
});

userRouter.get("/all", getAllUsers);
userRouter.post("/addFriend", addFriend);
userRouter.post("/deleteFriend", deleteFriendLimiter, deleteFriend);
userRouter.post('/checkFriendship', checkFriendship);

export default userRouter;