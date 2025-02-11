import express  from "express";
import { addFriend, getAllUsers, checkFriendship } from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authenticationMiddleware.js"; // Assuming the middleware is correctly set up
import { authorizeRole } from "../middlewares/roleMiddleware.js";

const userRouter = express.Router();

userRouter.get("/all", getAllUsers);
userRouter.post("/addFriend", addFriend);
userRouter.post('/checkFriendship', checkFriendship);

export default userRouter;