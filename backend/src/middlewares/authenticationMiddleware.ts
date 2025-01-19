import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest, DecodedToken } from "../types/types.js";

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

    let token;
    const authHeader = req.headers.Authorization || req.headers.authorization;
    if(authHeader && typeof authHeader === "string" && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        if (!token) return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
    
            if (!decoded) return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
            console.log(decoded);
    
            req.user = decoded
    
            next();

        } catch (error) {
            console.log("Error in verifyToken ", error);
            return res.status(400).json({ success: false, message: "Token is not valid error" });
        }

    } else {
        return res.status(400).json({ success: false, message: "No token is provided. Authorization denied." });
    }
}



export const verifyTokenForCheckAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log(req.cookies);
	const token = req.cookies.token;
	if (!token) return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
		if (!decoded) return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
        req.user = decoded;
		next();
	} catch (error) {
		console.log("Error in verifyToken ", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
};