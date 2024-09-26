import { Route, Routes } from "react-router-dom";
import './App.css'
import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/Signup/Signup.jsx";
import Home from "./pages/Home/Home.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import Ticket from "./pages/Contact/Tickets.jsx";
import ResponsiveAppBar from "./pages/Navbar/Navbar.jsx";
import { createContext, useContext } from "react";
import AuthProvider from "./components/AuthProvider.jsx";

export const KeycloakContext = createContext(null);

function App() {
    return (
        <>
        <AuthProvider>
            <ResponsiveAppBar/>
            <Routes> {/* Uses Routes to navigate on the website */}
                <Route path="/" element={<Home />} /> {/* Go to path "/", render the Home page */}
                <Route path="/signup" element={<Signup />} /> {/* Go to path "/signup", render the Signup page */}
                <Route path="/login" element={<Login />} /> {/* Go to path "/login", render the Login page */}
                <Route path="/contact" element={<Contact />} /> {/* Go to path "/contact", render the Contact page */}
                <Route path="/ticket" element={<Ticket />} /> {/* Go to path "/Ticket", render the Ticket page */}
            </Routes>
        </AuthProvider>
    </>
    )
}

export default App
