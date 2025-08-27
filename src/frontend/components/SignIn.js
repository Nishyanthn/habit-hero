import React, { useState, useEffect } from 'react';
import '../Styles/SignIn.css'; // Import the CSS for this component
import { Unlock, Key, Smile, BarChart, TrendingUp } from 'lucide-react';

// An array of catchy phrases with corresponding icons
const catchyPhrases = [
  { text: "Unlock Your Potential.", icon: <Unlock size={48} /> },
  { text: "Consistency is the Key.", icon: <Key size={48} /> },
  { text: "Build a Better You.", icon: <Smile size={48} /> },
  { text: "Master Your Habits.", icon: <BarChart size={48} /> },
  { text: "One Day at a Time.", icon: <TrendingUp size={48} /> }
];

export default function SignIn() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Effect to cycle through the catchy phrases
  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setFade(false); // Start fade out
      setTimeout(() => {
        setPhraseIndex((prevIndex) => (prevIndex + 1) % catchyPhrases.length);
        setFade(true); // Start fade in
      }, 600); // Wait for fade out to complete (increased duration)
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
          <h2 className="auth-title">Welcome Back!</h2>
          <p className="auth-subtitle">Sign in to continue your journey.</p>
          <form>
            <div className="auth-input-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="you@example.com" className="auth-form-input" />
            </div>
            <div className="auth-input-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="••••••••" className="auth-form-input" />
            </div>
            <button type="submit" className="auth-btn-submit">
              Sign In
            </button>
          </form>
          <p className="auth-switch-text">
            Don't have an account? <a href="/signup">Sign Up</a>
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
