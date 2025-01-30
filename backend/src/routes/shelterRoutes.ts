import express  from "express";
import { getShelters, saveShelters } from "../controllers/shelterController.js";

const shelterRouter = express.Router();

shelterRouter.get("/all", getShelters);
shelterRouter.post("/all", saveShelters);

export default shelterRouter;