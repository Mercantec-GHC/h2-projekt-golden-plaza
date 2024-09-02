import { Route, Routes } from "react-router-dom";
import './App.css'
import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/Signup/Signup.jsx";
import Home from "./pages/Home/Home.jsx";

function App() {

  return (
    <>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    </>
  )
}

export default App
