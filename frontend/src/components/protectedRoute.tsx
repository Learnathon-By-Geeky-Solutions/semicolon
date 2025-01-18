import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import {  ReactNode } from "react"

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    approved: boolean;
    permissions: string[];
    isVerfied: boolean; // Fixing the typo (was isVerfied)
    verificationToken?: string;
    verificationTokenExpiresAt?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  interface ProtectedRouteProps {
    children: ReactNode;
  }
  
  
  export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated } = useAuthStore() as {
      isAuthenticated: boolean;
      user: User | null;
    };
  
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
  
    return children;
  };