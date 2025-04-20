import express from "express";
import { body } from "express-validator";
import { getShelters, getSheltersWithRatingsAndReviews, saveShelters } from "../controllers/shelterController.js";
import rateLimit from "express-rate-limit"; 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const validateShelter = [
  body("shelterName").notEmpty().withMessage("Shelter name is required"),
  body("shelterAddress").notEmpty().withMessage("Shelter address is required"),
  body("shelterCity").notEmpty().withMessage("Shelter city is required"),
  body("shelterState").notEmpty().withMessage("Shelter state is required"),
  body("shelterZip").notEmpty().withMessage("Shelter zip is required"),
  body("shelterPhone").notEmpty().withMessage("Shelter phone is required"),
  body("shelterEmail").notEmpty().withMessage("Shelter email is required"),
  body("shelterWebsite").notEmpty().withMessage("Shelter website is required"),
  body("shelterDescription").notEmpty().withMessage("Shelter description is required"),
];

const shelterRouter = express.Router();

shelterRouter.get("/all", limiter, getShelters);
shelterRouter.post("/all", limiter, validateShelter, saveShelters);
shelterRouter.get("/allWithRatings", limiter, getSheltersWithRatingsAndReviews);

export default shelterRouter;
