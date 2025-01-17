import express  from "express";
import { test } from "../controllers/volunteerController.js";
const volunteerRouter = express.Router();



volunteerRouter.get("/", test);

// volunteerRouter.post("/signup", signup);
// volunteerRouter.post("/login", login);
// volunteerRouter.post("/logout", logout);


export default volunteerRouter;