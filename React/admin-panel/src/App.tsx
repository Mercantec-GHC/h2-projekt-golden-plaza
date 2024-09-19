import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

// To add new pages simply add a new Route component to the Routes component
// and then make sure to import the new page component at the top of this file
// if you're confused about how to do this, refer to the Home page

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
