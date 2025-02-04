import React from "react";
import { DashboardLayout } from "./dashboardLayout";


const AdminDashboard: React.FC = () => {
  return (
    <DashboardLayout userType="Admin">
      <p className="text-lg text-gray-600 mb-6">This is your dashboard.</p>
    </DashboardLayout>
  );
};

export default AdminDashboard;
