import express  from "express";
import { test } from "../controllers/adminController.js";
const adminRouter = express.Router();


adminRouter.get("/", test);

// adminRouter.post("/signup", signup);
// adminRouter.post("/login", login);
// adminRouter.post("/logout", logout);


export default adminRouter;