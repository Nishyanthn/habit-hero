import React, { useState, useEffect } from 'react';
// We remove useNavigate since we are not redirecting based on API calls anymore
// import { useNavigate } from 'react-router-dom'; 
import '../Styles/Dashboard.css';
import { Plus, Target, TrendingUp, CheckCircle, XCircle, Zap, Award, Book, Heart, Briefcase, Sun, Moon, LogOut, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import AddHabitModal from './AddHabitModal';

const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case 'health': return <Heart className="icon" />;
    case 'work': return <Briefcase className="icon" />;
    case 'learning': return <Book className="icon" />;
    default: return <Award className="icon" />;
  }
};

// --- Calendar Component ---
const Calendar = () => {
  const [date, setDate] = useState(new Date());

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(year, month + 1, 1));
  };

  const renderDays = () => {
    const days = [];
    // Padding for previous month's days
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
      days.push(
        <div key={i} className={`calendar-day ${isToday ? 'today' : ''}`}>
          {i}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrevMonth} className="calendar-nav-btn"><ChevronLeft size={20} /></button>
        <h3 className="calendar-month-year">{monthNames[month]} {year}</h3>
        <button onClick={handleNextMonth} className="calendar-nav-btn"><ChevronRight size={20} /></button>
      </div>
      <div className="calendar-grid">
        {daysOfWeek.map(day => <div key={day} className="calendar-weekday">{day}</div>)}
        {renderDays()}
      </div>
    </div>
  );
};


export default function Dashboard() {
  const [theme, setTheme] = useState('light');
  const [habits, setHabits] = useState([]); // This is now our only source of truth for habits
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user] = useState({ name: 'Nishyanth' }); // Static user for UI purposes
  const [stats, setStats] = useState({
    successRate: 0,
    currentStreak: 0,
    longestStreak: 0,
    habitsCompleted: 0,
  });

  // Theme Management remains the same
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  
  useEffect(() => {
    document.body.className = `${theme}-theme`;
  }, [theme]);

  // --- Calculate Stats ---
  useEffect(() => {
    const completed = habits.filter(h => h.completedToday).length;
    const total = habits.length;
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // NOTE: Streak logic would be more complex with a backend and historical data.
    // This is a simplified version for local state.
    const currentStreak = total > 0 && successRate === 100 ? (stats.currentStreak + 1) : 0;

    setStats(prevStats => ({
      successRate,
      habitsCompleted: completed,
      currentStreak: currentStreak,
      longestStreak: Math.max(prevStats.longestStreak, currentStreak),
    }));
  }, [habits]);


  // --- LOCAL STATE MANAGEMENT FUNCTIONS ---

  const handleAddHabit = (newHabit) => {
    // We add the new habit directly to our state array with a temporary ID
    setHabits(prevHabits => [
      ...prevHabits, 
      { ...newHabit, _id: Date.now().toString() } // Use a temporary unique ID
    ]);
  };
  
  const handleDeleteHabit = (habitId) => {
    // We filter the state array to remove the habit
    setHabits(prevHabits => prevHabits.filter(habit => habit._id !== habitId));
  };
  
  const handleToggleComplete = (habitToUpdate) => {
    // We map over the state array to update the specific habit
    setHabits(prevHabits => 
      prevHabits.map(habit => 
        habit._id === habitToUpdate._id 
          ? { ...habit, completedToday: !habit.completedToday, streak: habit.completedToday ? habit.streak -1 : habit.streak + 1 } 
          : habit
      )
    );
  };

  const handleLogout = () => {
    // In a real app, this would also clear local storage/state management
    // For now, it can just navigate. Or you can link it to the signin page.
    console.log("Logging out...");
    // navigate('/signin');
  };

  const greeting = new Date().getHours() < 12 ? 'Good Morning' : 'Good Evening';

  return (
    <>
      <AddHabitModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddHabit}
      />
      <div className="dashboard-container">
        <aside className="sidebar">
          <div className="sidebar-header"><span className="logo-accent">Habit</span> Hero</div>
          <div className="user-profile">
            <div className="user-avatar">{user.name?.charAt(0)}</div>
            <span className="user-name">{user.name}</span>
          </div>
          <button className="add-habit-btn" onClick={() => setIsModalOpen(true)}><Plus size={20} /><span>Add New Habit</span></button>
          <nav className="sidebar-nav">
            <a href="#" className="nav-item active">Dashboard</a>
            <a href="#" className="nav-item">Analytics</a>
            <a href="#" className="nav-item">Settings</a>
          </nav>
          <div className="sidebar-footer">
            <button className="logout-btn" onClick={handleLogout}><LogOut size={16} /><span>Log Out</span></button>
          </div>
        </aside>
        <main className="main-content">
          <header className="main-header">
            <div className="greeting">
              <h1>{greeting}, {user.name}!</h1>
              <p>Ready to build some great habits today?</p>
            </div>
            <button onClick={toggleTheme} className="theme-toggle-btn">{theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}</button>
          </header>
          <div className="habits-grid">
            {habits.length > 0 ? habits.map(habit => (
              <div key={habit._id} className="habit-card">
                <div className="habit-card-header">
                  <div className="habit-category-icon">{getCategoryIcon(habit.category)}</div>
                  <div className="habit-info">
                    <h3 className="habit-name">{habit.name}</h3>
                    <span className="habit-category">{habit.category}</span>
                  </div>
                  <div className="habit-options">
                    <button className="option-btn"><Edit size={16} /></button>
                    <button className="option-btn" onClick={() => handleDeleteHabit(habit._id)}><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="habit-card-body">
                  <div className="habit-streak"><Zap size={18} className="streak-icon" /><span>{habit.streak || 0} Day Streak</span></div>
                </div>
                <div className="habit-card-actions">
                  <button className={`action-btn ${habit.completedToday ? 'complete' : 'incomplete'}`} onClick={() => handleToggleComplete(habit)}>
                    {habit.completedToday ? <CheckCircle size={24} /> : <XCircle size={24} />}
                    <span>{habit.completedToday ? 'Completed' : 'Mark as Done'}</span>
                  </button>
                </div>
              </div>
            )) : (
              <div className="no-habits-message">
                <h3>No habits yet!</h3>
                <p>Click the "Add New Habit" button to get started.</p>
              </div>
            )}
          </div>
        </main>
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
              <span className="stat-value">{stats.successRate}%</span>
              <span className="stat-label">Success Rate</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon-wrapper" style={{ backgroundColor: 'hsla(142, 71%, 85%, 1)' }}>
              <TrendingUp className="stat-icon" style={{ color: 'hsla(142, 71%, 45%, 1)' }} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.longestStreak} Days</span>
              <span className="stat-label">Longest Streak</span>
            </div>
          </div>
           <div className="stat-item">
            <div className="stat-icon-wrapper" style={{ backgroundColor: 'hsla(231, 89%, 90%, 1)' }}>
              <Award className="stat-icon" style={{ color: 'hsla(231, 89%, 60%, 1)' }} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.habitsCompleted}</span>
              <span className="stat-label">Habits Completed</span>
            </div>
          </div>
        </div>
        <Calendar />
      </aside>
      </div>
    </>
  );
}
