import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for redirection
import { Target, BarChart2, CalendarCheck, Award } from 'lucide-react';
import '../Styles/OpeningPage.css'; // Import the CSS file

export default function Opening() {
  const navigate = useNavigate(); // Hook for navigation

  // --- State for the sign-up form ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // --- State for animations ---
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const features = [
    {
      icon: <Target className="feature-icon-svg" />,
      title: "Create & Customize Habits",
      description: "Define your habits with names, frequencies (daily, weekly), and categories that fit your life.",
      imgSrc: "https://placehold.co/600x400/1a1a1a/fde047?text=Customize"
    },
    {
      icon: <CalendarCheck className="feature-icon-svg" />,
      title: "Track Your Progress",
      description: "Easily check in each day or add notes to keep a diary of your journey towards consistency.",
      imgSrc: "https://placehold.co/600x400/1a1a1a/fde047?text=Track"
    },
    {
      icon: <BarChart2 className="feature-icon-svg" />,
      title: "Visualize Your Success",
      description: "See your streaks, success rates, and best days with our insightful analytics and charts.",
      imgSrc: "https://placehold.co/600x400/1a1a1a/fde047?text=Visualize"
    },
    {
      icon: <Award className="feature-icon-svg" />,
      title: "Gamify Your Journey",
      description: "Earn badges and experience points as you build your habits, making the process fun and rewarding.",
      imgSrc: "https://placehold.co/600x400/1a1a1a/fde047?text=Gamify"
    },
  ];

  // --- Handle form submission ---
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Account created! Redirecting to sign in...');
        setTimeout(() => {
          navigate('/signin'); // Redirect to sign-in page
        }, 2000);
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
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <nav className="container nav">
          <div className="logo">
            <span className="logo-accent">Habit</span> Hero
          </div>
          <div className="nav-buttons">
            <button className="btn-signin" onClick={() => navigate('/signin')}>
              Sign In
            </button>
            <button className="btn-signup" onClick={() => navigate('/signup')}>
              Sign Up
            </button>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-gradient-overlay"></div>
          <div className="container hero-content">
            <div className={`hero-text-animation ${isMounted ? 'visible' : ''}`}>
              <h1>
                Build Habits That <span className="text-accent">Actually Stick</span>.
              </h1>
              <p>
                Habit Hero helps you create powerful routines, stay consistent, and unlock your full potential, one small step at a time.
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="features-section">
          {/* ... (feature mapping code remains the same) ... */}
           <div className="container">
            <div className="section-header">
              <h2>Why You'll Love <span className="text-accent-dark">Habit Hero</span></h2>
              <p>Everything you need to build a better you.</p>
            </div>
            
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className={`feature-card ${index % 2 !== 0 ? 'reversed' : ''}`}>
                  <div className="feature-image-container">
                    <img 
                      src={feature.imgSrc} 
                      alt={feature.title} 
                      className="feature-image"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/cccccc/ffffff?text=Image+Error'; }}
                    />
                  </div>
                  <div className="feature-text-container">
                    <div className="feature-title-wrapper">
                      <div className="feature-icon-background">
                        {feature.icon}
                      </div>
                      <h3>{feature.title}</h3>
                    </div>
                    <p className="feature-description">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sign-Up Form Section */}
        <section id="signup" className="signup-section">
          <div className="signup-gradient-overlay"></div>
          <div className="container signup-content">
            <h2 className="section-title">Ready to Build a Better You?</h2>
            <p className="section-subtitle">Create your free account and start your journey with Habit Hero today. Consistency is just a click away.</p>
            <div className="signup-form-card">
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    className="form-input" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <input 
                    type="email" 
                    placeholder="Your Email Address" 
                    className="form-input" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <input 
                    type="password" 
                    placeholder="Choose a Password" 
                    className="form-input" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                {/* --- Message Display --- */}
                {error && <p className="auth-error-message">{error}</p>}
                {success && <p className="auth-success-message">{success}</p>}

                <button type="submit" className="btn-submit" disabled={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Create Your Free Account'}
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Habit Hero. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
