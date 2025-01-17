import { Request} from "express";

export interface DecodedToken {
    id: string;
    email: string,
    role: string;
}
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string,
        role: string;
    };
}