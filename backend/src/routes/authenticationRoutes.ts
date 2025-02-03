import express  from "express";
import { login, signup, logout, checkAuth, googleRedirect, googleCallback, googleCallbackHandler, verifyEmail, forgotPassword, resetPassword } from "../controllers/authenticationController.js";
import { loginValidator, signupValidator, validate } from "../middlewares/validationMiddleware.js";
import upload from "../middlewares/fileUploadMiddleware.js";
import { verifyTokenForCheckAuth } from "../middlewares/authenticationMiddleware.js";

const authenticationRouter = express.Router();

authenticationRouter.post("/signup", upload.single("document"), validate(signupValidator), signup);
authenticationRouter.post("/login", validate(loginValidator), login);
authenticationRouter.post("/logout", logout);
authenticationRouter.get("/check-auth", verifyTokenForCheckAuth , checkAuth);

authenticationRouter.post("/verify-email", verifyEmail);
authenticationRouter.post("/forgot-password", forgotPassword); 
authenticationRouter.post("/reset-password/:token", resetPassword);

authenticationRouter.get("/google", googleRedirect);
authenticationRouter.get("/google/callback", googleCallback, googleCallbackHandler);

export default authenticationRouter;