import React, { useState, useEffect } from 'react';
import '../Styles/SignUp.css'; // Using a separate CSS, though it can share styles with SignIn

import { Rocket, Target, BrainCircuit, Award, Sparkles } from 'lucide-react';

// An array of catchy phrases for the sign-up page
const catchyPhrases = [
  { text: "Start Your Journey.", icon: <Rocket size={48} /> },
  { text: "Set Your Targets.", icon: <Target size={48} /> },
  { text: "Design Your Life.", icon: <BrainCircuit size={48} /> },
  { text: "New Habits, New You.", icon: <Award size={48} /> },
  { text: "Commit to Growth.", icon: <Sparkles size={48} /> }
];

export default function SignUp() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Effect to cycle through the catchy phrases
  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setFade(false); // Start fade out
      setTimeout(() => {
        setPhraseIndex((prevIndex) => (prevIndex + 1) % catchyPhrases.length);
        setFade(true); // Start fade in
      }, 600); // Wait for fade out to complete
    }, 4000); // Change phrase every 4 seconds

    return () => clearInterval(phraseInterval);
  }, []);

  const currentPhrase = catchyPhrases[phraseIndex];

  return (
    <div className="auth-container">
      {/* Left side: The Form */}
      <div className="auth-form-section">
        <div className="auth-form-card">
          <div className="auth-logo">
            <span className="auth-logo-accent">Habit</span> Hero
          </div>
          <h2 className="auth-title">Create Your Account</h2>
          <p className="auth-subtitle">Join us and start building better habits today.</p>
          <form>
            <div className="auth-input-group">
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" placeholder="John Doe" className="auth-form-input" />
            </div>
            <div className="auth-input-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="you@example.com" className="auth-form-input" />
            </div>
            <div className="auth-input-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="••••••••" className="auth-form-input" />
            </div>
            <button type="submit" className="auth-btn-submit">
              Create Account
            </button>
          </form>
          <p className="auth-switch-text">
            Already have an account? <a href="/signin">Sign In</a>
          </p>
        </div>
      </div>

      {/* Right side: The Animated Content */}
      <div className="auth-content-section">
        {/* Floating shapes for decoration */}
        <div className="floating-shape shape1"></div>
        <div className="floating-shape shape2"></div>
        <div className="floating-shape shape3"></div>

        <div className={`auth-phrase-wrapper ${fade ? 'fade-in' : 'fade-out'}`}>
          <div className="auth-phrase-icon">{currentPhrase.icon}</div>
          <h1 className="auth-phrase-text">{currentPhrase.text}</h1>
        </div>
      </div>
    </div>
  );
}
