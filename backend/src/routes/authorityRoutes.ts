import express  from "express";
import { test } from "../controllers/authorityController.js";
const authorityRouter = express.Router();


authorityRouter.get("/", test);
// authorityRouter.post("/signup", signup);
// authorityRouter.post("/login", login);
// authorityRouter.post("/logout", logout);


export default authorityRouter;