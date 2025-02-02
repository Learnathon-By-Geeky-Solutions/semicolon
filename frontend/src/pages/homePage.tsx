import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import PageLayout from "../components/layout/pageLayout";
import { mainNavItems } from "../config/navigation";

const HomePage: React.FC = () => {
  const navigate = useNavigate(); 
    const { logout, isAuthenticated, user } = useAuthStore();
  

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSignUpClick = () => {
    navigate("/signup"); 
  };
  const handleLogoutClick = async () => {
    await logout();
    window.location.reload();
    navigate("/"); 
  };

  const handleDashboardClick = () => {
    const roleBasedRedirect: Record<string, string> = {
      admin: "/admin",
      authority: "/authority",
      volunteer: "/volunteer",
      user: "/user",
    };
    if (user && user.role in roleBasedRedirect) {
      navigate(roleBasedRedirect[user.role]);
    }
  };

  return (


    <div>

      {isAuthenticated && (
            <PageLayout
            title="Home"
            navItems={mainNavItems}
          >
            <div className="container mx-auto px-4 py-8">
              {/* Hero Section */}
              <div className="flex flex-col items-center text-center p-6 md:p-12 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-green-800 mb-4">CrisisCompass</h1>
                <p className="text-lg text-gray-600 mb-6">
                  A powerful and efficient platform to help you navigate shelters, resources, and disaster
                  management tasks with ease.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                 
                    <>
                      <button
                        className="px-6 py-3 bg-green-800 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-800 transition duration-300"
                        onClick={handleDashboardClick}
                      >
                        Dashboard
                      </button>
                      <button
                        className="px-6 py-3 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition duration-300"
                        onClick={handleLogoutClick}
                      >
                        Log Out
                      </button>
                    </>
              
                </div>
              </div>
      
              {/* Footer */}
              <footer className="text-center py-6 mt-8 text-gray-600">
                <p>&copy; 2025 Disaster Management App. All rights reserved.</p>
              </footer>
            </div>
          </PageLayout>
      )}

      {!isAuthenticated && (
           <div className="container mx-auto px-4 py-8">
           {/* Hero Section */}
           <div className="flex flex-col items-center text-center p-6 md:p-12 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
             <h1 className="text-4xl font-bold text-green-800 mb-4">CrisisCompass</h1>
             <p className="text-lg text-gray-600 mb-6">
               A powerful and efficient platform to help you navigate shelters, resources, and disaster
               management tasks with ease.
             </p>
             <div className="flex flex-col sm:flex-row gap-4">
              
                 <>
                   <button
                     className="px-6 py-3 bg-green-800 text-white rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-800 transition duration-300"
                     onClick={handleLoginClick}
                   >
                     Login
                   </button>
                   <button
                     className="px-6 py-3 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 transition duration-300"
                     onClick={handleSignUpClick}
                   >
                     Sign Up
                   </button>
                 </>
           
             </div>
           </div>
   
           {/* Footer */}
           <footer className="text-center py-6 mt-8 text-gray-600">
             <p>&copy; 2025 Disaster Management App. All rights reserved.</p>
           </footer>
         </div>
      )}
    </div>
  );
};

export default HomePage;
