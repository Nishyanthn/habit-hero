// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import OpeningPage from "./frontend/components/OpeningPage";
import SignIn from "./frontend/components/SignIn";
import SignUp from "./frontend/components/SignUp";
import Dashboard from "./frontend/components/Dashboard";
import Analytics from "./frontend/components/Analytics"; // ✅ Import Analytics

// Styles
import "./frontend/Styles/OpeningPage.css";
import "./frontend/Styles/SignIn.css";
import "./frontend/Styles/SignUp.css";
import "./frontend/Styles/Dashboard.css";  // ✅ Add Dashboard styles
import "./frontend/Styles/Analytics.css";  // ✅ Add Analytics styles

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

        {/* Analytics Page */}
        <Route path="/dashboard/analytics" element={<Analytics />} /> 
        {/* ✅ Nested under dashboard for better flow */}
      </Routes>
    </Router>
  );
}

export default App;
