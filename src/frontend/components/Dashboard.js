import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Dashboard.css';
import { Plus, Target, TrendingUp, CheckCircle, XCircle, Zap, Award, Book, Heart, Briefcase, Sun, Moon, LogOut, Edit, Trash2, ChevronLeft, ChevronRight, MessageSquare, Trophy } from 'lucide-react';
import AddHabitModal from './AddHabitModal';
import Analytics from './Analytics';
import NotesModal from './NotesModal';
import Settings from './Settings';

// --- NEW: Helper function to create authenticated headers ---
const getAuthHeaders = () => {
    const token = localStorage.getItem('habitHeroToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case 'health': return <Heart className="icon" />;
    case 'work': return <Briefcase className="icon" />;
    case 'learning': return <Book className="icon" />;
    default: return <Award className="icon" />;
  }
};

const Calendar = () => {
    const [date, setDate] = useState(new Date());
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const handlePrevMonth = () => setDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setDate(new Date(year, month + 1, 1));
    const renderDays = () => {
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) { days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>); }
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = i === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
            days.push(<div key={i} className={`calendar-day ${isToday ? 'today' : ''}`}>{i}</div>);
        }
        return days;
    };
    return (
        <div className="calendar-container">
            <div className="calendar-header"><button onClick={handlePrevMonth} className="calendar-nav-btn"><ChevronLeft size={20} /></button><h3 className="calendar-month-year">{monthNames[month]} {year}</h3><button onClick={handleNextMonth} className="calendar-nav-btn"><ChevronRight size={20} /></button></div>
            <div className="calendar-grid">{daysOfWeek.map(day => <div key={day} className="calendar-weekday">{day}</div>)}{renderDays()}</div>
        </div>
    );
};

export default function Dashboard() {
  const [theme, setTheme] = useState('light');
  const [habits, setHabits] = useState([]);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [viewingNotesFor, setViewingNotesFor] = useState(null);
  const [user, setUser] = useState({ name: 'User', email: '' });
  const [stats, setStats] = useState({ successRate: 0, longestStreak: 0, habitsCompleted: 0, bestHabit: null });
  const [activePage, setActivePage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  
  useEffect(() => { document.body.className = `${theme}-theme`; }, [theme]);

  const fetchHabits = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/api/habits`, { headers: getAuthHeaders() });
      if (!response.ok) {
        if (response.status === 401) navigate('/signin');
        throw new Error('Could not fetch habits');
      }
      const data = await response.json();
      setHabits(data.map(h => ({...h, _id: h._id || h.id }))); // Normalize ID
    } catch (error) {
      console.error("Fetch habits error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate, apiUrl]);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/api/profile`, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error('Not logged in');
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      localStorage.removeItem('habitHeroToken');
      navigate('/signin');
    }
  }, [navigate, apiUrl]);

  useEffect(() => {
    fetchProfile();
    fetchHabits();
  }, [fetchProfile, fetchHabits]);

  useEffect(() => {
    const completed = habits.filter(h => h.completedToday).length;
    const total = habits.length;
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    let longestStreak = 0;
    let bestHabit = null;
    if (habits.length > 0) {
        bestHabit = habits.reduce((prev, current) => ((prev.streak || 0) > (current.streak || 0)) ? prev : current);
        longestStreak = bestHabit.streak || 0;
    }
    setStats({ successRate, longestStreak, habitsCompleted: completed, bestHabit });
  }, [habits]);

  const handleAddClick = () => { setEditingHabit(null); setIsAddEditModalOpen(true); };
  const handleEditClick = (habit) => { setEditingHabit(habit); setIsAddEditModalOpen(true); };
  const handleNotesClick = (habit) => { setViewingNotesFor(habit); setIsNotesModalOpen(true); };

  const handleSaveHabit = async (habitData) => {
    const url = editingHabit ? `${apiUrl}/api/habits/${editingHabit._id}` : `${apiUrl}/api/habits`;
    const method = editingHabit ? 'PUT' : 'POST';
    try {
        await fetch(url, {
            method: method,
            headers: getAuthHeaders(),
            body: JSON.stringify(habitData)
        });
        fetchHabits(); // Refetch all habits to get the latest state
    } catch (error) {
        console.error("Save habit error:", error);
    }
    setEditingHabit(null);
  };
  
  const handleDeleteHabit = async (habitId) => { 
    try {
        await fetch(`${apiUrl}/api/habits/${habitId}`, { method: 'DELETE', headers: getAuthHeaders() });
        fetchHabits();
    } catch (error) {
        console.error("Delete habit error:", error);
    }
  };
  
  const handleToggleComplete = async (habitToUpdate) => {
    try {
        await fetch(`${apiUrl}/api/habits/${habitToUpdate._id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ completedToday: !habitToUpdate.completedToday })
        });
        fetchHabits();
    } catch (error) {
        console.error("Toggle complete error:", error);
    }
  };

  const handleSaveNote = (habitId, noteText) => {
    // This part is still local, would require a new backend endpoint
    const newNote = { text: noteText, date: new Date().toISOString() };
    setHabits(habits.map(h => h._id === habitId ? { ...h, notes: [...(h.notes || []), newNote] } : h));
    setViewingNotesFor(prev => ({...prev, notes: [...(prev.notes || []), newNote]}));
  };
  
  const handleLogout = () => {
    localStorage.removeItem('habitHeroToken');
    navigate('/signin');
  };

  const greeting = new Date().getHours() < 12 ? 'Good Morning' : 'Good Evening';

  const renderActivePage = () => {
    switch (activePage) {
        case 'dashboard': return <HabitsView />;
        case 'analytics': return <Analytics habits={habits} onAddHabit={handleSaveHabit} />;
        case 'settings': return <Settings user={user} onProfileUpdate={fetchProfile} />;
        default: return <HabitsView />;
    }
  }

  const HabitsView = () => (
    <>
      <header className="main-header"><div className="greeting"><h1>{greeting}, {user.name}!</h1><p>Ready to build some great habits today?</p></div><button onClick={toggleTheme} className="theme-toggle-btn">{theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}</button></header>
      <div className="habits-grid">
        {isLoading ? <p>Loading...</p> : habits.length > 0 ? habits.map(habit => (
          <div key={habit._id} className="habit-card">
            <div className="habit-card-header"><div className="habit-category-icon">{getCategoryIcon(habit.category)}</div><div className="habit-info"><h3 className="habit-name">{habit.name}</h3><span className="habit-category">{habit.category}</span></div><div className="habit-options"><button className="option-btn" title="Add Note" onClick={() => handleNotesClick(habit)}><MessageSquare size={16} /></button><button className="option-btn" title="Edit Habit" onClick={() => handleEditClick(habit)}><Edit size={16} /></button><button className="option-btn" title="Delete Habit" onClick={() => handleDeleteHabit(habit._id)}><Trash2 size={16} /></button></div></div>
            <div className="habit-card-body"><div className="habit-streak"><Zap size={18} className="streak-icon" /><span>{habit.streak || 0} Day Streak</span></div></div>
            <div className="habit-card-actions"><button className={`action-btn ${habit.completedToday ? 'complete' : 'incomplete'}`} onClick={() => handleToggleComplete(habit)}>{habit.completedToday ? <CheckCircle size={24} /> : <XCircle size={24} />}<span>{habit.completedToday ? 'Completed' : 'Mark as Done'}</span></button></div>
          </div>
        )) : (
          <div className="no-habits-message"><h3>No habits yet!</h3><p>Click the "Add New Habit" button to get started.</p></div>
        )}
      </div>
    </>
  );

  return (
    <>
      <AddHabitModal isOpen={isAddEditModalOpen} onClose={() => setIsAddEditModalOpen(false)} onSave={handleSaveHabit} habitToEdit={editingHabit} />
      <NotesModal isOpen={isNotesModalOpen} onClose={() => setIsNotesModalOpen(false)} habit={viewingNotesFor} onSaveNote={handleSaveNote} />
      <div className="dashboard-container">
        <aside className="sidebar"><div className="sidebar-header"><span className="logo-accent">Habit</span> Hero</div><div className="user-profile"><div className="user-avatar">{user.name?.charAt(0)}</div><span className="user-name">{user.name}</span></div><button className="add-habit-btn" onClick={handleAddClick}><Plus size={20} /><span>Add New Habit</span></button><nav className="sidebar-nav"><button className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`} onClick={() => setActivePage('dashboard')}>Dashboard</button><button className={`nav-item ${activePage === 'analytics' ? 'active' : ''}`} onClick={() => setActivePage('analytics')}>Analytics</button><button className={`nav-item ${activePage === 'settings' ? 'active' : ''}`} onClick={() => setActivePage('settings')}>Settings</button></nav><div className="sidebar-footer"><button className="logout-btn" onClick={handleLogout}><LogOut size={16} /><span>Log Out</span></button></div></aside>
        <main className="main-content">{renderActivePage()}</main>
        <aside className="stats-panel"><div className="stats-header"><h2>Your Progress</h2></div><div className="stats-card"><div className="stat-item"><div className="stat-icon-wrapper" style={{ backgroundColor: 'var(--accent-light)' }}><Target className="stat-icon" style={{ color: 'var(--accent-dark)' }} /></div><div className="stat-info"><span className="stat-value">{stats.successRate}%</span><span className="stat-label">Today's Success</span></div></div><div className="stat-item"><div className="stat-icon-wrapper" style={{ backgroundColor: 'hsla(142, 71%, 85%, 1)' }}><TrendingUp className="stat-icon" style={{ color: 'hsla(142, 71%, 45%, 1)' }} /></div><div className="stat-info"><span className="stat-value">{stats.longestStreak} Days</span><span className="stat-label">Longest Streak</span></div></div><div className="stat-item"><div className="stat-icon-wrapper" style={{ backgroundColor: 'hsla(51, 98%, 85%, 1)' }}><Trophy className="stat-icon" style={{ color: 'hsla(51, 98%, 50%, 1)' }} /></div><div className="stat-info"><span className="stat-value">{stats.bestHabit ? stats.bestHabit.name : 'N/A'}</span><span className="stat-label">Best Habit</span></div></div></div><Calendar /></aside>
      </div>
    </>
  );
}
