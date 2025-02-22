import express from "express";
import RateLimit from "express-rate-limit";
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  getReviewsByShelterId,
} from "../controllers/shelterReviewController.js";

const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

const shelterReviewRouter = express.Router();

shelterReviewRouter.use(limiter);

shelterReviewRouter.get("/all", getReviews);
shelterReviewRouter.post("/create", createReview);
shelterReviewRouter.post("/update", updateReview);
shelterReviewRouter.post("/delete", deleteReview);
shelterReviewRouter.post("/getReviewsByShelterId", getReviewsByShelterId);
export default shelterReviewRouter;
