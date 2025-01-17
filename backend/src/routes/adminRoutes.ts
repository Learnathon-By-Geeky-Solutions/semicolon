import express  from "express";
import { test } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.get("/", test);

export default adminRouter;