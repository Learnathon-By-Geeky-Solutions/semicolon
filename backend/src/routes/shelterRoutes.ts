import express from "express";
import { body } from "express-validator";
import { getShelters, getSheltersWithRatingsAndReviews, saveShelters } from "../controllers/shelterController.js";
import rateLimit from "express-rate-limit";
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const validateShelter = [
  body("shelters").isArray(),
  body("shelters.*.name").isString(),
  body("shelters.*.lat").isNumeric(),
  body("shelters.*.lng").isNumeric(),
  body("shelters.*.district_id").isString(),
  body("shelters.*.food").isNumeric(),
  body("shelters.*.water").isNumeric(),
  body("shelters.*.medicine").isNumeric(),
];

const shelterRouter = express.Router();

shelterRouter.get("/all", limiter, getShelters);
shelterRouter.post("/all", limiter, validateShelter, saveShelters);
shelterRouter.get("/allWithRatings", limiter, getSheltersWithRatingsAndReviews);

export default shelterRouter;
