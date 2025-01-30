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
import SheltersPage from "./pages/sheltersPage";
import DistrictPage from "./pages/districtPage";
import ManageSheltersPage from "./pages/manageSheltersPage";
import ResourceAnalytictsPage from "./pages/resourceAnalytictsPage";
import { ProtectedRoute } from "./components/protectedRoute";
import { RedirectAuthenticatedUser } from "./components/redirectAuthenticatedUser";
import AllocateDistrictResources from "./pages/allocateDistrictResources";

/**
 * The main application component, which contains the navigation and authentication logic.
 * This component is responsible for rendering the correct page based on the user's authentication state and location.
 * It also handles the logic for the browser's back/forward buttons and forces a reload on location change.
 * @returns The main application component.
 */
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

        <Route path="/shelters" element={<SheltersPage/>} />
        <Route path="/manage-shelters" element={<ManageSheltersPage/>} />
        <Route path="/districts" element={<DistrictPage />} />
        <Route path="/resource-analyticts" element={<ResourceAnalytictsPage/>} />
        <Route path="/allocate-district-resources" element={<AllocateDistrictResources/>} />
        <Route path="/logout" element={"LOGOUT"} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
