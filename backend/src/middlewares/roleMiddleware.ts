import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/types.js";

export const authorizeRole = (...allowedRoles : string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {

        
        console.log(req.user.role);
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
        }
        next();
    };
}