import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import HomePage  from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import SignUpPage from "./pages/signupPage";
import AdminDashboard from "./pages/adminDashboard";
import AuthorityDashboard from "./pages/authorityDashboard";
import VolunteerDashboard from "./pages/volunteerDashboard";
import UserDashboard from "./pages/userDashboard";
import Shelters from "./pages/shelters";
import DistrictPage from "./pages/districtPage";
import ManageSheltersPage from "./pages/manageSheltersPage";

import { ProtectedRoute } from "./components/protectedRoute";
import { RedirectAuthenticatedUser } from "./components/redirectAuthenticatedUser";

function App() {
  const location = useLocation();

  const { user, isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log("Auth State:", { isAuthenticated, user });
  }, [isAuthenticated, user]);

  useEffect(() => {
    // Add event listener for browser back/forward buttons
    const handlePopState = () => {
      window.location.reload();
    };

    window.addEventListener('popstate', handlePopState);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Optional: Force reload on location change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div> 
      <Routes>
        
        <Route path="/" element={<HomePage/>} />
        
        <Route path="/signup" element={<RedirectAuthenticatedUser> <SignUpPage/> </RedirectAuthenticatedUser>} />
        <Route path="/login" element={ <RedirectAuthenticatedUser> <LoginPage/></RedirectAuthenticatedUser> } />

        <Route path="/admin" element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>} />
        <Route path="/authority" element={ <ProtectedRoute>  <AuthorityDashboard/> </ProtectedRoute>} />
        <Route path="/volunteer" element={<ProtectedRoute> <VolunteerDashboard/> </ProtectedRoute>} />
        <Route path="/user" element={<ProtectedRoute><UserDashboard/></ProtectedRoute>} />

        <Route path="/shelters" element={<Shelters/>} />
        <Route path="/manage-shelters" element={<ManageSheltersPage/>} />
        <Route path="/districts" element={<DistrictPage />} />
        
        <Route path="/logout" element={"LOGOUT"} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
