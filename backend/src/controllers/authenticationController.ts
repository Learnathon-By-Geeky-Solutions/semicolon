import { NextFunction, Request, Response } from "express";
import { hash, compare } from 'bcrypt';
import { User } from "../models/userModel.js";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
import { COOKIE_NAME } from "../constants/auth.js";


export const signup = async (req:Request, res:Response, next:NextFunction) => {

        const {email, password, name, role} = req.body;
        try {
            if(!email || !password || !name || !role){
                throw new Error ("All fields are required");
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
        res.clearCookie(COOKIE_NAME);
	    res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log("Error logging out ", error);
		res.status(400).json({ success: false, message: error.message });
    }
	
};


