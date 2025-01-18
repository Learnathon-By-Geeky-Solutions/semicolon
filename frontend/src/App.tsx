import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect,  } from "react";
import HomePage  from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import SignUpPage from "./pages/signupPage";
import AdminDashboard from "./pages/adminDashboard";
import AuthorityDashboard from "./pages/authorityDashboard";
import VolunteerDashboard from "./pages/volunteerDashboard";
import UserDashboard from "./pages/userDashboard";


import { ProtectedRoute } from "./components/protectedRoute";
import { RedirectAuthenticatedUser } from "./components/redirectAuthenticatedUser";

function App() {

  const { user, isAuthenticated, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    console.log("Auth State:", { isAuthenticated, user });
  }, [isAuthenticated, user]); 

  return (
    <>
      <div> 
        <Routes>
          
          <Route path="/" element={<HomePage/>} />
          
          <Route path="/signup" element={<RedirectAuthenticatedUser> <SignUpPage/> </RedirectAuthenticatedUser>} />
          <Route path="/login" element={ <RedirectAuthenticatedUser> <LoginPage/></RedirectAuthenticatedUser> } />

          <Route path="/admin" element={<ProtectedRoute><AdminDashboard/></ProtectedRoute>} />
          <Route path="/authority" element={ <ProtectedRoute>  <AuthorityDashboard/> </ProtectedRoute>} />
          <Route path="/volunteer" element={<ProtectedRoute> <VolunteerDashboard/> </ProtectedRoute>} />
          <Route path="/user" element={<ProtectedRoute><UserDashboard/></ProtectedRoute>} />


          <Route path="/logout" element={"LOGOUT"} />
        </Routes>
        <Toaster />
      </div>
    </>
  )
}

export default App
