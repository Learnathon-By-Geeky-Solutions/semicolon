import express from "express";
import {
  login,
  signup,
  logout,
  checkAuth,
  googleLogin,
  updateProfile,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controllers/authenticationController.js";
import {
  loginValidator,
  signupValidator,
  validate,
} from "../middlewares/validationMiddleware.js";
import upload from "../middlewares/fileUploadMiddleware.js";
import { verifyTokenForCheckAuth } from "../middlewares/authenticationMiddleware.js";
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const authenticationRouter = express.Router();

authenticationRouter.use(limiter);

authenticationRouter.post(
  "/signup",
  upload.single("document"),
  validate(signupValidator),
  signup,
);
authenticationRouter.post("/login", validate(loginValidator), login);
authenticationRouter.post("/logout", logout);
authenticationRouter.get("/check-auth", verifyTokenForCheckAuth, checkAuth);

authenticationRouter.post("/verify-email", verifyEmail);
authenticationRouter.post("/update-profile", updateProfile);
authenticationRouter.post("/forgot-password", forgotPassword);
authenticationRouter.post("/reset-password/:token", resetPassword);

authenticationRouter.get("/google", googleLogin);

export default authenticationRouter;
