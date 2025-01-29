import express  from "express";
import { getDistricts, createDistrict, updateDistrict, deleteDistrict, getDistrictById } from "../controllers/districtController.js";

const districtRouter = express.Router();

districtRouter.get("/all", getDistricts);
districtRouter.post("/create", createDistrict);
districtRouter.post("/update", updateDistrict);
districtRouter.post("/delete", deleteDistrict);
districtRouter.post("/getDistrictById", getDistrictById);
export default districtRouter;