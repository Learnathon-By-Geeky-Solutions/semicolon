import express from "express";
import RateLimit from "express-rate-limit";
import {
  getDistricts,
  createDistrict,
  updateDistrict,
  deleteDistrict,
  getDistrictById,
} from "../controllers/districtController.js";

const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

const districtRouter = express.Router();

districtRouter.use(limiter);

districtRouter.get("/all", getDistricts);
districtRouter.post("/create", createDistrict);
districtRouter.post("/update", updateDistrict);
districtRouter.post("/delete", deleteDistrict);
districtRouter.post("/getDistrictById", getDistrictById);
export default districtRouter;
