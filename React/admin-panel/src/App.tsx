import "./App.css";
import { Routes, Route } from "react-router-dom";
import { createContext } from "react";
import Home from "./pages/Home";
import RoomManagement from "./pages/RoomManagement.tsx";
import RoomTypeManagement from "./pages/RoomTypeManagement.tsx";
import BatchImport from "./pages/BatchImport.tsx";
import AuthProvider from "./components/AuthProvider.tsx";
import Sidebar from "./components/Sidebar.tsx";
import Tickets from "./pages/Tickets.tsx";
import BookingManagement from "./pages/BookingManagement.tsx";

export const KeycloakContext = createContext<{
  keycloak: Keycloak.KeycloakInstance | null;
  init: () => Promise<void>;
}>({
  keycloak: null,

  init: () => Promise.resolve(),
});

// To add new pages simply add a new Route component to the Routes component
// and then make sure to import the new page component at the top of this file
// if you're confused about how to do this, refer to the Home page

function App() {
  return (
    <>
      {/* AuthProvider is used to make sure the user is authorized to access these pages. Specifically if they are logged in. */}
      <AuthProvider>
        <Sidebar />
        <Routes>
          {/* The Routes component is where you define the routes for your app */}
          <Route path="/" element={<Home />} />
          <Route path="/roommanagement" element={<RoomManagement />} />
          <Route path="/tickets" element={<Tickets />} />
          <Route path="/roomtypes" element={<RoomTypeManagement />} />
          <Route path="/bookings" element={<BookingManagement />} />
          <Route path="/batch-import" element={<BatchImport />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
