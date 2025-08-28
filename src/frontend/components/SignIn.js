import React, { useState, useEffect } from 'react';
import '../Styles/SignIn.css';
import { Unlock, Key, Smile, BarChart, TrendingUp } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const catchyPhrases = [
  { text: "Unlock Your Potential.", icon: <Unlock size={48} /> },
  { text: "Consistency is the Key.", icon: <Key size={48} /> },
  { text: "Build a Better You.", icon: <Smile size={48} /> },
  { text: "Master Your Habits.", icon: <BarChart size={48} /> },
  { text: "One Day at a Time.", icon: <TrendingUp size={48} /> }
];

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const phraseInterval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPhraseIndex((prevIndex) => (prevIndex + 1) % catchyPhrases.length);
        setFade(true);
      }, 600);
    }, 4000);
    return () => clearInterval(phraseInterval);
  }, []);

  const currentPhrase = catchyPhrases[phraseIndex];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/api/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // --- NEW: Save the token to localStorage ---
        localStorage.setItem('habitHeroToken', data.token);
        navigate('/dashboard');
      } else {
        setError(data.msg || 'An unknown error occurred.');
      }
    } catch (error) {
      setError('Could not connect to the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-section">
        <div className="auth-form-card">
          <div className="auth-logo"><span className="auth-logo-accent">Habit</span> Hero</div>
          <h2 className="auth-title">Welcome Back!</h2>
          <p className="auth-subtitle">Sign in to continue your journey.</p>
          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="you@example.com" className="auth-form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="auth-input-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="••••••••" className="auth-form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="auth-error-message">{error}</p>}
            <button type="submit" className="auth-btn-submit" disabled={isLoading}>{isLoading ? 'Signing In...' : 'Sign In'}</button>
          </form>
          <p className="auth-switch-text">Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
      </div>
      <div className="auth-content-section">
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
