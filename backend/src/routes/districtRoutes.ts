import express  from "express";
import { getDistricts, createDistrict, updateDistrict, deleteDistrict } from "../controllers/districtController.js";

const districtRouter = express.Router();

districtRouter.get("/all", getDistricts);
districtRouter.post("/create", createDistrict);
districtRouter.post("/update", updateDistrict);
districtRouter.post("/delete", deleteDistrict);

export default districtRouter;