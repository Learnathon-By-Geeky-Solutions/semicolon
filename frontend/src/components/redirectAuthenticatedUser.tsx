import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore"; // Adjust the path as needed

interface User {
  email: string; // Email is now used for the unique path
  name: string;
  role: string;
  approved: boolean;
  permissions: string[];
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
  family: string[]; 
  users: string[];
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
      const roleBasedRedirect: Record<string, (identifier: string) => string> = {
        admin: () => "/admin",
        authority: () => "/authority",
        volunteer: () => "/volunteer",
        user: (email) => `/user/${encodeURIComponent(email)}`, // Dynamic path for users based on email
      };

      const path = roleBasedRedirect[user.role]?.(user.email) || "/";
      console.log(`Redirecting to: ${path}`);
      setRedirectPath(path);
    }
  }, [isAuthenticated, user]);

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};
