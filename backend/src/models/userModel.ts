import mongoose from "mongoose";
import { Role, Permission, RolePermissions } from "../constants/roles.js";

const userSchema = new mongoose.Schema({

    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), required: true, default: Role.User },
    districtId: { type: String }, 
    approved: { type: Boolean, default: false },
    permissions: { type: [String], enum: Object.values(Permission) },
    documents: { type: String }, 
    isVerfied: {type: Boolean, default : false},

    resetPasswordToken : String,
    resetPasswordExpiresAt : Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,

}, { timestamps: true });

userSchema.pre('save', function (next) {
   
    if (this.isNew) {
        const rolePermissions = RolePermissions[this.role]; 
        this.permissions = rolePermissions;
    }
    next(); 
});

export const User = mongoose.model("User", userSchema);
