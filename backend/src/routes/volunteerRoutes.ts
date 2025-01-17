import express  from "express";
import { test } from "../controllers/volunteerController.js";

const volunteerRouter = express.Router();

volunteerRouter.get("/", test);

export default volunteerRouter;