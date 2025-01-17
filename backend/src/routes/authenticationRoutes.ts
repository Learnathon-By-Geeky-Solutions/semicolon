import express  from "express";
import { login, signup, logout } from "../controllers/authenticationController.js";
import { loginValidator, signupValidator, validate } from "../middlewares/validationMiddleware.js";

const authenticationRouter = express.Router();

authenticationRouter.post("/signup", validate(signupValidator), signup);
authenticationRouter.post("/login", validate(loginValidator), login);
authenticationRouter.post("/logout", logout);

export default authenticationRouter;