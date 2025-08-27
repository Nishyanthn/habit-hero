import React, { useState, useEffect } from 'react';
import '../Styles/SignIn.css'; // Your existing CSS file
import { Rocket, Target, BrainCircuit, Award, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// An array of catchy phrases for the sign-up page
const catchyPhrases = [
  { text: "Start Your Journey.", icon: <Rocket size={48} /> },
  { text: "Set Your Targets.", icon: <Target size={48} /> },
  { text: "Design Your Life.", icon: <BrainCircuit size={48} /> },
  { text: "New Habits, New You.", icon: <Award size={48} /> },
  { text: "Commit to Growth.", icon: <Sparkles size={48} /> }
];

export default function SignUp() {
    const navigate = useNavigate();
  // --- State for the form inputs ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- State for the animated phrases ---
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Effect to cycle through the catchy phrases
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

  // --- Handle form submission ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await fetch(`${apiUrl}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Account created successfully! You can now sign in.');
        setTimeout(() => {
            navigate('/signin'); // Redirect to sign-in page after 2 seconds
        }, 2000);
        // Clear the form on success
        setName('');
        setEmail('');
        setPassword('');
      } else {
        setError(data.msg || 'An unknown error occurred.');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      setError('Could not connect to the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

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
          
          {/* --- The Form with onSubmit handler --- */}
          <form onSubmit={handleSubmit}>
            <div className="auth-input-group">
              <label htmlFor="name">Your Name</label>
              <input 
                type="text" 
                id="name" 
                placeholder="John Doe" 
                className="auth-form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="auth-input-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="you@example.com" 
                className="auth-form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="auth-input-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="••••••••" 
                className="auth-form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* --- Message Display --- */}
            {error && <p className="auth-error-message">{error}</p>}
            {success && <p className="auth-success-message">{success}</p>}

            <button type="submit" className="auth-btn-submit" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p className="auth-switch-text">
            Already have an account? <a href="/signin">Sign In</a>
          </p>
        </div>
      </div>

      {/* Right side: The Animated Content */}
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