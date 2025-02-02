import { NextFunction, Request, Response } from "express";
import {ValidationChain, body, validationResult } from "express-validator"

export const validate = (validations : ValidationChain[]) =>{
    return async (req : Request, res : Response, next : NextFunction) => {
        for(let validation of validations)
        {
            const result = await validation.run(req);
            if(!result.isEmpty()){
                break;
            }
        }
        const errors = validationResult(req);
        if(errors.isEmpty()){
            return next();
        }
        return res.status(422).json({errors : errors.array()});
    };
};

export const loginValidator = [
    body("email").trim().isEmail().withMessage("Email is required"),
    body("password").trim().isLength({min:6}).withMessage("Password is required to be at least 6 characters"),
];

export const signupValidator = [
    body("name").notEmpty().withMessage("Name is required"),
    ...loginValidator,
    body("role")
        .isIn(["user", "admin", "authority", "volunteer"])
        .withMessage("Invalid role"),
    body("document").custom((_, { req }) => {
        if ((req.body.role === "authority" || req.body.role === "volunteer") && !req.file) {
            throw new Error("Document upload is required for this role");
        }
        return true;
    }),
    body("district_id").custom((_, { req }) => {
        if ((req.body.role === "authority" || req.body.role === "volunteer") && !req.body.district_id) {
            throw new Error("District is required for this role");
        }
        return true;
    }),
];
