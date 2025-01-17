import express  from "express";
import { login, signup, logout } from "../controllers/authenticationController.js";
import { loginValidator, signupValidator, validate } from "../middlewares/validationMiddleware.js";
import upload from "../middlewares/fileUploadMiddleware.js";

const authenticationRouter = express.Router();

authenticationRouter.post("/signup", upload.single("document"), validate(signupValidator), signup);
authenticationRouter.post("/login", validate(loginValidator), login);
authenticationRouter.post("/logout", logout);

export default authenticationRouter;