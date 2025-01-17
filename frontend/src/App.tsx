import { Route, Routes } from "react-router-dom";
import HomePage  from "./pages/homePage";
import LoginPage from "./pages/loginPage";
import SignUpPage from "./pages/signupPage";

function App() {
 

  return (
    <>
      <div> 
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/signup" element={<SignUpPage/>} />
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/logout" element={"LOGOUT"} />
        </Routes>
      </div>
    </>
  )
}

export default App
