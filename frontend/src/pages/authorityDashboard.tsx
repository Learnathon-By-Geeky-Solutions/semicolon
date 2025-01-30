import React from "react";
import PageLayout from "../components/layout/pageLayout";
import { mainNavItems } from "../config/navigation";


const AuthorityDashboard: React.FC = () => {


  return (
    <div>
      <PageLayout
      title="Welcome, Authority!"
      navItems={mainNavItems}
    >
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-3xl font-bold mb-4">Welcome, Authority!</h1>
        <p className="text-lg text-gray-600 mb-6">This is your dashboard.</p>
      </div>
      </PageLayout>
    </div>
  )
};

export default AuthorityDashboard;
