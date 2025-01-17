import { Request} from "express";

export interface DecodedToken {
    userId: string;
    email: string,
    role: string;
}
export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string,
        role: string;
    };
}
export interface CustomRequest extends Request {
    userId: string; 
    email: string;
    role: string;
}