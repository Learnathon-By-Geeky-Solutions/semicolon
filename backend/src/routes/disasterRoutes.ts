import express from "express";
import { getDisasters, saveDisasters } from "../controllers/disasterController.js";
import rateLimit from "express-rate-limit"; 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});


const disasterRouter = express.Router();

disasterRouter.get("/all", limiter, getDisasters);
disasterRouter.post("/all", limiter, saveDisasters);

export default disasterRouter;
