import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import HomePage  from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import SignUpPage from "./pages/signupPage";
import ForgotPasswordPage from "./pages/forgotPasswordPage";
import AdminDashboard from "./pages/adminDashboard";
import AuthorityDashboard from "./pages/authorityDashboard";
import VolunteerDashboard from "./pages/volunteerDashboard";
import UserDashboard from "./pages/userDashboard";
import SheltersPage from "./pages/sheltersPage";
import DistrictPage from "./pages/districtPage";
import ManageSheltersPage from "./pages/manageSheltersPage";
import ResourceAnalytictsPage from "./pages/resourceAnalytictsPage";
import { ProtectedRoute } from "./components/protectedRoute";
import { RedirectAuthenticatedUser } from "./components/redirectAuthenticatedUser";
import AllocateDistrictResources from "./pages/allocateDistrictResources";
import Settings from "./pages/settingsPage";
import ResetPasswordPage from "./pages/resetPasswordPage";
import FriendDashboard from "./pages/friendDashboard";
import ShelterAnalyticsPage from "./pages/shelterAnalyticsPage";
import FamilyStatus from "./pages/familyStatus";


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
      
        <Route path="/forgot-password" element={<ForgotPasswordPage/>} />
        <Route path="/reset-password/:token" element={<RedirectAuthenticatedUser> <ResetPasswordPage/> </RedirectAuthenticatedUser>} />

        <Route path="/admin" element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>} />
        <Route path="/authority" element={ <ProtectedRoute>  <AuthorityDashboard/> </ProtectedRoute>} />
        <Route path="/volunteer" element={<ProtectedRoute> <VolunteerDashboard/> </ProtectedRoute>} />
        <Route path="/user/:email" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} /> {/* Dynamic user route */}
        <Route path="/friend/:email" element={<ProtectedRoute><FriendDashboard /></ProtectedRoute>} /> 
        <Route path="/shelters" element={<ProtectedRoute> <SheltersPage/> </ProtectedRoute>} />
        <Route path="/manage-shelters" element={<ProtectedRoute> <ManageSheltersPage/> </ProtectedRoute>} />
        <Route path="/districts" element={<ProtectedRoute>  <DistrictPage /> </ProtectedRoute>} />
        <Route path="/resource-analyticts" element={ <ProtectedRoute>  <ResourceAnalytictsPage/>  </ProtectedRoute>} />
        <Route path="/shelter-analytics" element={ <ProtectedRoute>  <ShelterAnalyticsPage/>  </ProtectedRoute>} />
        <Route path="/allocate-district-resources" element={ <ProtectedRoute>  <AllocateDistrictResources/> </ProtectedRoute>} />
        <Route path="/settings" element={ <ProtectedRoute>  <Settings/> </ProtectedRoute>} />
        <Route path="/family-status" element={ <ProtectedRoute>  <FamilyStatus/> </ProtectedRoute>} />
        <Route path="/logout" element={"LOGOUT"} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
