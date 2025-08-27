// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import OpeningPage from "./frontend/components/OpeningPage";
import SignIn from "./frontend/components/SignIn";
import SignUp from "./frontend/components/SignUp";
import Dashboard from "./frontend/components/Dashboard";


// Styles
import "./frontend/Styles/OpeningPage.css";
import "./frontend/Styles/SignIn.css";
import "./frontend/Styles/SignUp.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Opening Page */}
        <Route path="/" element={<OpeningPage />} />

        {/* Sign In Page */}
        <Route path="/signin" element={<SignIn />} />

        {/* Sign Up Page */}
        <Route path="/signup" element={<SignUp />} />

        {/* Dashboard Page */}
        <Route path="/dashboard" element={<Dashboard />} />
       
      </Routes>
    </Router>
  );
}

export default App;
