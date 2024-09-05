import { Route, Routes } from "react-router-dom";
import './App.css'
import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/Signup/Signup.jsx";
import Home from "./pages/Home/Home.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import ResponsiveAppBar from "./pages/Navbar/Navbar.jsx";


function App() {

    return (
        <>
            <ResponsiveAppBar/>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>

        </>
    )
}

export default App
