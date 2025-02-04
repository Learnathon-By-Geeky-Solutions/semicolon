import React from "react";
import PageLayout from "../components/layout/pageLayout";
import { mainNavItems } from "../config/navigation";

interface DashboardLayoutProps {
  userType: 'Admin' | 'User' | 'Volunteer' | 'Authority';
  children?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ userType, children }) => {
  return (
    <div>
      <PageLayout
        title={`${userType} Dashboard`}
        navItems={mainNavItems}
      >
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard!</h1>
          {children}
        </div>
      </PageLayout>
    </div>
  );
};