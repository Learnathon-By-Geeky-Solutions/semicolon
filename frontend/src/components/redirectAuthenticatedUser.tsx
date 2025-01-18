import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore"; // Adjust the path as needed

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  approved: boolean;
  permissions: string[];
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface RedirectAuthenticatedUserProps {
  children: ReactNode;
}

export const RedirectAuthenticatedUser = ({ children }: RedirectAuthenticatedUserProps) => {
  const { isAuthenticated, user } = useAuthStore() as {
    isAuthenticated: boolean;
    user: User | null;
  };

  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      const roleBasedRedirect: Record<string, string> = {
        admin: "/admin",
        authority: "/authority",
        volunteer: "/volunteer",
        user: "/user",
      };

      const path = roleBasedRedirect[user.role] || "/";
      console.log(`Redirecting to: ${path}`);
      setRedirectPath(path); 
    }
  }, [isAuthenticated, user]);

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

