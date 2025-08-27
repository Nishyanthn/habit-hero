import React, { useState, useEffect } from 'react';
import '../Styles/Dashboard.css';  // The updated CSS file
import { Plus, Target, TrendingUp, CheckCircle, XCircle, Zap, Award, Book, Heart, Briefcase, Sun, Moon, LogOut } from 'lucide-react';

// Mock data for demonstration purposes. This will later come from your API.
const mockHabits = [
  { id: 1, name: 'Read for 20 minutes', category: 'Learning', frequency: 'Daily', streak: 12, completedToday: true },
  { id: 2, name: 'Morning Run', category: 'Health', frequency: 'Daily', streak: 4, completedToday: false },
  { id: 3, name: 'Drink 8 glasses of water', category: 'Health', frequency: 'Daily', streak: 25, completedToday: true },
  { id: 4, name: 'Plan tomorrow\'s tasks', category: 'Work', frequency: 'Daily', streak: 88, completedToday: false },
  { id: 5, name: 'Weekly project review', category: 'Work', frequency: 'Weekly', streak: 6, completedToday: false },
];

// Helper to get an icon based on category
const getCategoryIcon = (category) => {
  switch (category.toLowerCase()) {
    case 'health': return <Heart className="icon" />;
    case 'work': return <Briefcase className="icon" />;
    case 'learning': return <Book className="icon" />;
    default: return <Award className="icon" />;
  }
};

export default function Dashboard() {
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  // Effect to apply the theme class to the body for global styles
  useEffect(() => {
    document.body.className = ''; // Clear existing classes
    document.body.classList.add(`${theme}-theme`);
  }, [theme]);

  const greeting = new Date().getHours() < 12 ? 'Good Morning' : 'Good Evening';
  const user = { name: 'Nishyanth' }; // This would come from your user context or API

  return (
    <div className="dashboard-container">
      {/* --- Left Sidebar --- */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <span className="logo-accent">Habit</span> Hero
        </div>
        <div className="user-profile">
          <div className="user-avatar">{user.name.charAt(0)}</div>
          <span className="user-name">{user.name}</span>
        </div>
        <button className="add-habit-btn">
          <Plus size={20} />
          <span>Add New Habit</span>
        </button>
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">Dashboard</a>
          <a href="#" className="nav-item">Analytics</a>
          <a href="#" className="nav-item">Settings</a>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn">
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="main-content">
        <header className="main-header">
          <div className="greeting">
            <h1>{greeting}, {user.name}!</h1>
            <p>Ready to build some great habits today?</p>
          </div>
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </header>

        <div className="habits-grid">
          {mockHabits.map(habit => (
            <div key={habit.id} className="habit-card">
              <div className="habit-card-header">
                <div className="habit-category-icon">
                  {getCategoryIcon(habit.category)}
                </div>
                <div className="habit-info">
                  <h3 className="habit-name">{habit.name}</h3>
                  <span className="habit-category">{habit.category}</span>
                </div>
              </div>
              <div className="habit-card-body">
                <div className="habit-streak">
                  <Zap size={18} className="streak-icon" />
                  <span>{habit.streak} Day Streak</span>
                </div>
              </div>
              <div className="habit-card-actions">
                <button className={`action-btn ${habit.completedToday ? 'complete' : 'incomplete'}`}>
                  {habit.completedToday ? <CheckCircle size={24} /> : <XCircle size={24} />}
                  <span>{habit.completedToday ? 'Completed' : 'Mark as Done'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- Right Stats Panel --- */}
      <aside className="stats-panel">
        <div className="stats-header">
          <h2>Your Progress</h2>
        </div>
        <div className="stats-card">
          <div className="stat-item">
            <div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--accent-light)' }}>
              <Target className="stat-icon" style={{ color: 'var(--accent-dark)' }} />
            </div>
            <div className="stat-info">
              <span className="stat-value">75%</span>
              <span className="stat-label">Success Rate</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon-wrapper" style={{ backgroundColor: 'hsla(142, 71%, 85%, 1)' }}>
              <TrendingUp className="stat-icon" style={{ color: 'hsla(142, 71%, 45%, 1)' }} />
            </div>
            <div className="stat-info">
              <span className="stat-value">25 Days</span>
              <span className="stat-label">Longest Streak</span>
            </div>
          </div>
           <div className="stat-item">
            <div className="stat-icon-wrapper" style={{ backgroundColor: 'hsla(231, 89%, 90%, 1)' }}>
              <Award className="stat-icon" style={{ color: 'hsla(231, 89%, 60%, 1)' }} />
            </div>
            <div className="stat-info">
              <span className="stat-value">5</span>
              <span className="stat-label">Habits Mastered</span>
            </div>
          </div>
        </div>
        <div className="motivation-quote">
          <p>"The secret of your future is hidden in your daily routine."</p>
          <span>- Mike Murdock</span>
        </div>
      </aside>
    </div>
  );
}
