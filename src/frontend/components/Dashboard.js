import React, { useState, useEffect } from 'react';
import '../Styles/Dashboard.css'; // The updated CSS file
import { Plus, Target, TrendingUp, CheckCircle, XCircle, Zap, Award, Book, Heart, Briefcase, Sun, Moon, LogOut, Edit, Trash2 } from 'lucide-react';
import AddHabitModal from './AddHabitModal'; // Import the modal component

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
  const [theme, setTheme] = useState('light');
  const [habits, setHabits] = useState([]); // State to hold the habits
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  useEffect(() => {
    document.body.className = '';
    document.body.classList.add(`${theme}-theme`);
  }, [theme]);

  // --- Habit Management Functions ---
  const handleAddHabit = (newHabit) => {
    // In a real app, you'd send this to the backend.
    // Here, we'll just add it to our local state with a temporary ID.
    setHabits(prevHabits => [...prevHabits, { ...newHabit, id: Date.now() }]);
  };
  
  const handleDeleteHabit = (habitId) => {
    // In a real app, you'd send a DELETE request to the backend.
    setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId));
  };

  const handleEditHabit = (habitId) => {
    // This would open the modal with the habit's data pre-filled.
    // For now, we'll just log it.
    console.log("Editing habit:", habitId);
  };


  const greeting = new Date().getHours() < 12 ? 'Good Morning' : 'Good Evening';
  const user = { name: 'Nishyanth' };

  return (
    <>
      <AddHabitModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddHabit}
      />
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
          <button className="add-habit-btn" onClick={() => setIsModalOpen(true)}>
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
            {habits.length > 0 ? habits.map(habit => (
              <div key={habit.id} className="habit-card">
                <div className="habit-card-header">
                  <div className="habit-category-icon">
                    {getCategoryIcon(habit.category)}
                  </div>
                  <div className="habit-info">
                    <h3 className="habit-name">{habit.name}</h3>
                    <span className="habit-category">{habit.category}</span>
                  </div>
                  <div className="habit-options">
                     <button className="option-btn" onClick={() => handleEditHabit(habit.id)}><Edit size={16} /></button>
                     <button className="option-btn" onClick={() => handleDeleteHabit(habit.id)}><Trash2 size={16} /></button>
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
            )) : (
              <div className="no-habits-message">
                <h3>No habits yet!</h3>
                <p>Click the "Add New Habit" button to get started.</p>
              </div>
            )}
          </div>
        </main>

        {/* --- Right Stats Panel --- */}
        <aside className="stats-panel">
          {/* ... stats panel code remains the same ... */}
        </aside>
      </div>
    </>
  );
}
