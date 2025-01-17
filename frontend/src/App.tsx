import { Route, Routes } from "react-router-dom";
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
          <Route path="/signup" element={<SignUpPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/admin" element={<AdminDashboard/>} />
          <Route path="/authority" element={<AuthorityDashboard/>} />
          <Route path="/volunteer" element={<VolunteerDashboard/>} />
          <Route path="/user" element={<UserDashboard/>} />


          <Route path="/logout" element={"LOGOUT"} />
        </Routes>
        <Toaster />
      </div>
    </>
  )
}

export default App
