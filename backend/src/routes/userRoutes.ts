import express  from "express";
import { test } from "../controllers/userController.js";
const userRouter = express.Router();


userRouter.get("/", test);

// userRouter.post("/signup", signup);
// userRouter.post("/login", login);
// userRouter.post("/logout", logout);


export default userRouter;