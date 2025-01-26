import { NextFunction, Request, Response } from "express";
import { hash, compare } from 'bcrypt';
import { User } from "../models/userModel.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import {  AuthenticatedRequest } from "../types/types.js";
import passport from "passport";
import { Role } from "../constants/roles.js";


export const signup = async (req:Request, res:Response, next:NextFunction) => {

        const {email, password, name, role} = req.body;
        const documentFile = req.file;
        try {
            if(!email || !password || !name || !role){
                throw new Error ("All fields are required");
            }
            if ((role === "authority" || role === "volunteer") && !documentFile) {
                return res.status(400).json({ success: false, message: "Document upload is required for this role." });
            }
            const userAlreadyExist = await User.findOne({email});
            if(userAlreadyExist){
                return res.status(400).json({success: false, message: "User already exists"});
            }
            const hashedPassword = await hash(password, 10);
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

            const user = new User ({
                name : name,
                email : email,
                password : hashedPassword,
                role : role,
                documents: documentFile ? documentFile.buffer : null,
                verificationToken : verificationCode,
                verificationTokenExpiresAt: Date.now() + 24*60*60*1000 // 24 hours validity 
            })
            await user.save();

            generateTokenAndSetCookie(res, user._id, user.email, user.role);
            res.status(201).json({
                success: true,
                message : "user created successfully",
                user : {
                    ...user.toObject(),
                    password : undefined,
                }

            })


        } catch (error) {
            return res.status(201).json({success: false, message: error.message});
        }
}

export const login = async (req : Request, res : Response, next: NextFunction) => {

	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await compare(password, user.password);
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
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

export const logout = async (req : Request, res : Response, next: NextFunction) => {
    try {
        res.clearCookie("token");
	    res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log("Error logging out ", error);
		res.status(400).json({ success: false, message: error.message });
    }
	
};

export const checkAuth = async  (req : AuthenticatedRequest, res : Response, next: NextFunction) => {
	try {
        const user = await User.findOne({ _id: req.user.userId });
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
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

export const googleRedirect = passport.authenticate("google", { scope: ["profile", "email"] });

export const googleCallback = passport.authenticate("google", { failureRedirect: "/login" });

export const googleCallbackHandler = (req: Request, res: Response) => {
    console.log("googleCallbackHandler done");
    // Redirect to frontend dashboard or desired page
    console.log(req);
    res.redirect("https://5cf2-103-203-92-101.ngrok-free.app"); // e.g., https://your-frontend.com/
};


export const googleSignup = async (accessToken, refreshToken, profile, done) => {
    // At this point, user is authenticated
    
    if(profile.emails[0].value){
        const user = await User.findOne({email: profile.emails[0].value});
        if(!user){

            const hashedPassword = await hash(profile.id, 10);

            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            const newUser = await User.create({
                email: profile.emails[0].value,
                name: profile.displayName,
                password: hashedPassword,
                role: Role.User,
                documents: null,
                verificationToken: verificationCode,
                verificationTokenExpiresAt: Date.now() + 24*60*60*1000,
            });

            console.log(newUser);
            console.log('newUser created');
            done(null, newUser);
        }
        else{
            console.log(user);
            console.log('user found');
            done(null, user);
        }
    }
    else{
        console.log('profile found');
        done(null, profile);
    }
};
