import jwt from "jsonwebtoken";
import { Response } from "express";
import { COOKIE_NAME } from "../constants/auth.js";

export const generateTokenAndSetCookie = (res:Response, userId, email, role) => {
	const token = jwt.sign({ userId, email, role }, process.env.JWT_SECRET, {
		expiresIn: "7d",
	});

	res.cookie(COOKIE_NAME, token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});

	return token;
};