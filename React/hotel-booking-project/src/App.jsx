import { Route, Routes } from "react-router-dom";
import './App.css'
import BookingManagement from "./pages/Booking/BookingManagement.jsx";
import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/Signup/Signup.jsx";
import Home from "./pages/Home/Home.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import Ticket from "./pages/Contact/Tickets.jsx";
import Booking from "./pages/Home/Cards/BookingRoom.jsx";
import Rooms from "./pages/Home/Cards/RoomDisplay.jsx";
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
                <Route path="/ticket" element={<Ticket />} /> {/* Go to path "/ticket", render the Ticket page */}
                <Route path="/manage-booking" element={<BookingManagement />} /> {/* Go to path "/manage-booking", render the Manage booking page */}
                <Route path="/booking" element={<Booking />} /> {/* Go to path "/booking", render the Booking page */}
                <Route path="/rooms" element={<Rooms />} /> {/* Go to path "/rooms", render the Rooms page */}
            </Routes>
        </AuthProvider>
    </>
    )
}

export default App
