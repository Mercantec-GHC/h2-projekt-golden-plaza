import "./App.css";
import { Routes, Route } from "react-router-dom";
import { createContext } from "react";
import Home from "./pages/Home";
import RoomManagement from "./pages/RoomManagement.tsx";
import RoomTypeManagement from "./pages/RoomTypeManagement.tsx";
import BatchImport from "./pages/BachImport.tsx";
import AuthProvider from "./components/AuthProvider.tsx";
import Sidebar from "./components/Sidebar.tsx";

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
      <AuthProvider>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/roommanagement" element={<RoomManagement />} />
          <Route path="/roomtypes" element={<RoomTypeManagement />} />
          <Route path="/batch-import" element={<BatchImport />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
