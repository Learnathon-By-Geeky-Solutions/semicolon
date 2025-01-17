import express  from "express";
import { test } from "../controllers/authorityController.js";

const authorityRouter = express.Router();

authorityRouter.get("/", test);

export default authorityRouter;