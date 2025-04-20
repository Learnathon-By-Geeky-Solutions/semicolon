import { NextFunction, Request, Response } from "express";
import { hash, compare } from "bcrypt";
import { User } from "../models/userModel.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import { AuthenticatedRequest } from "../types/types.js";
import { Role } from "../constants/roles.js";
import { generateVerificationCode } from "../utils/generateVerficationCode.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessEmail,
} from "../mailtrap/emails.js";
import * as crypto from "crypto";
import { oauth2client } from '../utils/googleConfig.js';
import axios from 'axios';

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password, name, role, district_id } = req.body;
  const documentFile = req.file;
  try {
    if (!email || !password || !name || !role) {
      throw new Error("All fields are required");
    }
    if ((role === "authority" || role === "volunteer") && !documentFile) {
      return res.status(400).json({
        success: false,
        message: "Document upload is required for this role.",
      });
    } else if ((role === "authority" || role === "volunteer") && !district_id) {
      return res.status(400).json({
        success: false,
        message: "District is required for this role.",
      });
    }
    const userAlreadyExist = await User.findOne({ email });
    if (userAlreadyExist) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const hashedPassword = await hash(password, 10);
    const verificationCode = generateVerificationCode();

    const user = new User({
      name: name,
      email: email,
      password: hashedPassword,
      role: role,
      documents: documentFile ? documentFile.buffer : null,
      verificationToken: verificationCode,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours validity
      district_id: district_id ?? null,
    });
    await user.save();

    generateTokenAndSetCookie(res, user._id, user.email, user.role);

    await sendVerificationEmail(user.email, verificationCode);

    res.status(201).json({
      success: true,
      message: "user created successfully",
      user: {
        ...user.toObject(),
        password: undefined,
      },
    });
  } catch (error) {
    return res.status(201).json({ success: false, message: error.message });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    generateTokenAndSetCookie(res, user._id, user.email, user.role);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user.toObject(),
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in login ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log("Error logging out ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user.toObject(),
        password: undefined,
      },
    });
  } catch (error) {
    console.log("Error in checkAuth ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const googleLogin = async (req, res) => {
  try{
    const { code } = req.query;
    const googleRes = await oauth2client.getToken(code);
    oauth2client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=' + googleRes.tokens.access_token,
    );

    const {email, name, sub} = userRes.data;
    const user = await User.findOne({ email: email });
    if (!user) {
      const hashedPassword = await hash(sub, 10);
      const newUser = await User.create({
        email: email,
        name: name,
        password: hashedPassword,
        role: Role.User,
        documents: null,
      });

      await user.save();

      console.log(newUser);
      console.log("newUser created");
    }

    generateTokenAndSetCookie(res, user._id, user.email, user.role);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user.toObject(),
        password: undefined,
      },
    });

  }
  catch(error){
    console.log("Error in googleLogin ", error);
    res.status(400).json({ success: false, message: error.message });
  }
}

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, verificationCode } = req.body;
  const user = await User.findOne({ email: { $eq: email } });
  if (user && user.verificationToken === verificationCode) {
    user.isVerified = true;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user.toObject(),
        password: undefined,
      },
    });
  } else {
    res
      .status(400)
      .json({ success: false, message: "Invalid verification code" });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: { $eq: email } });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

    await sendPasswordResetEmail(
      user.email,
      `${process.env.FRONTEND_ORIGIN}/reset-password/${resetToken}`,
    );

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("Error in forgotPassword", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      console.log("Invalid or Expired Reset Token");
      return res
        .status(400)
        .json({ success: false, message: "Invalid or Expired Reset Token" });
    }

    const hashedPassword = await hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    await user.save();

    await sendResetSuccessEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in Sending Reset Email", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
