import React, { useState, useEffect } from 'react';
import '../Styles/Analytics.css';
import { BarChart, Zap, Target, BrainCircuit, Award, Star, ShieldCheck, Coffee, Heart, X } from 'lucide-react';

// --- Achievements Definition ---
const allAchievements = [
  { id: 'first_habit', title: 'Getting Started', description: 'Create your first habit.', icon: <Star size={32} /> },
  { id: 'one_week_streak', title: 'Consistent', description: 'Maintain a 7-day streak on any habit.', icon: <ShieldCheck size={32} /> },
  { id: 'health_focus', title: 'Health Nut', description: 'Complete a Health habit 10 times.', icon: <Heart size={32} /> },
  { id: 'perfect_day', title: 'Perfect Day', description: 'Complete all your daily habits.', icon: <Award size={32} /> },
  { id: 'early_bird', title: 'Early Bird', description: 'Complete a habit before 8 AM.', icon: <Coffee size={32} /> },
];

// --- AI Suggestions Engine ---
const aiGoalSuggestions = {
  'improve_focus': { title: "Mindful Morning", description: "Try 5 minutes of meditation each morning.", category: 'Learning' },
  'be_more_active': { title: "Mid-day Walk", description: "Take a 15-minute walk after lunch.", category: 'Health' },
  'learn_skill': { title: "Skill Up", description: "Dedicate 20 minutes to an online course.", category: 'Learning' },
};

// --- Achievement Modal Component ---
const AchievementModal = ({ achievement, onClose }) => {
  if (!achievement) return null;
  return (
    <div className="achievement-modal-overlay" onClick={onClose}>
      <div className="achievement-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Confetti elements */}
        {[...Array(10)].map((_, i) => <div key={i} className="confetti"></div>)}
        <button className="close-modal-btn" onClick={onClose}><X size={24} /></button>
        <div className="modal-icon">{achievement.icon}</div>
        <h2>Congratulations!</h2>
        <h3>You've earned the "{achievement.title}" badge!</h3>
        <p>{achievement.description}</p>
      </div>
    </div>
  );
};

export default function Analytics({ habits, onAddHabit }) { // Accept onAddHabit prop
  const [earnedAchievements, setEarnedAchievements] = useState([]);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [addedSuggestionTitle, setAddedSuggestionTitle] = useState(null);

  // Calculate stats
  const totalHabits = habits.length;
  const completedToday = habits.filter(h => h.completedToday).length;
  const overallSuccess = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  const bestStreak = totalHabits > 0 ? Math.max(0, ...habits.map(h => h.streak)) : 0;

  // Gamification & AI Logic
  useEffect(() => {
    const earned = [];
    if (habits.length > 0) earned.push('first_habit');
    if (habits.some(h => h.streak >= 7)) earned.push('one_week_streak');
    if (overallSuccess === 100 && totalHabits > 0) earned.push('perfect_day');
    if (habits.some(h => h.category.toLowerCase() === 'health' && h.streak >= 10)) earned.push('health_focus');
    setEarnedAchievements(earned);
  }, [habits, totalHabits, overallSuccess]);

  const handleGoalSelect = (goal) => {
    setAiSuggestion(aiGoalSuggestions[goal]);
  };

  const handleAddSuggestedHabit = (suggestion) => {
    const newHabit = {
        name: suggestion.title,
        category: suggestion.category,
        frequency: 'Daily',
        days: [],
        notifications: false,
        notificationTime: null,
    };
    onAddHabit(newHabit); // Call the function passed from Dashboard
    setAddedSuggestionTitle(suggestion.title); // Provide user feedback
  };

  return (
    <>
      <AchievementModal achievement={selectedAchievement} onClose={() => setSelectedAchievement(null)} />
      <div className="analytics-content">
        <header className="analytics-header">
          <h1>Your Analytics</h1>
          <p>A detailed look at your journey of consistency.</p>
        </header>

        <div className="analytics-grid">
          <div className="left-column">
            {/* --- Habit Performance --- */}
            <div className="performance-container">
              <h2>Habit Performance</h2>
              {habits.length > 0 ? (
                <div className="performance-list">
                  {habits.map(habit => (
                    <div key={habit._id} className="habit-performance-item">
                      <span className="habit-name">{habit.name}</span>
                      <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${Math.min(100, (habit.streak / 30) * 100)}%`, backgroundColor: 'var(--accent-dark)' }}></div>
                      </div>
                      <span className="percentage">{habit.streak} day streak</span>
                    </div>
                  ))}
                </div>
              ) : ( <p className="no-data-message">No habits to analyze yet.</p> )}
            </div>

            {/* --- AI Suggestions --- */}
            <div className="ai-suggestions-container">
              <div className="ai-header"><BrainCircuit size={24} /><h2>AI Habit Coach</h2></div>
              <p className="ai-subtitle">What's your current goal? Select one to get a new habit idea.</p>
              <div className="ai-goals">
                  <button onClick={() => handleGoalSelect('improve_focus')}>Improve Focus</button>
                  <button onClick={() => handleGoalSelect('be_more_active')}>Be More Active</button>
                  <button onClick={() => handleGoalSelect('learn_skill')}>Learn a Skill</button>
              </div>
              {aiSuggestion && (
                  <div className="suggestion-card active">
                      <h3>{aiSuggestion.title}</h3>
                      <p>{aiSuggestion.description}</p>
                      <button 
                        onClick={() => handleAddSuggestedHabit(aiSuggestion)}
                        disabled={addedSuggestionTitle === aiSuggestion.title}
                      >
                        {addedSuggestionTitle === aiSuggestion.title ? 'Added!' : 'Add this habit'}
                      </button>
                  </div>
              )}
            </div>
          </div>

          <div className="right-column">
            {/* --- Key Metrics --- */}
            <div className="stats-grid-condensed">
              <div className="stat-card">
                <div className="stat-card-icon" style={{ backgroundColor: 'var(--accent-light)' }}><Target style={{ color: 'var(--accent-dark)' }} /></div>
                <h3>Today's Success</h3><p>{overallSuccess}%</p>
              </div>
              <div className="stat-card">
                <div className="stat-card-icon" style={{ backgroundColor: 'hsla(142, 71%, 85%, 1)' }}><Zap style={{ color: 'hsla(142, 71%, 45%, 1)' }} /></div>
                <h3>Best Streak</h3><p>{bestStreak} Days</p>
              </div>
            </div>
            
            {/* --- Achievements --- */}
            <div className="achievements-container">
              <h2>Achievements</h2>
              <div className="badges-grid">
                {allAchievements.map(badge => {
                  const isEarned = earnedAchievements.includes(badge.id);
                  return (
                    <button key={badge.id} className={`badge ${isEarned ? 'earned' : ''}`} onClick={() => isEarned && setSelectedAchievement(badge)} disabled={!isEarned}>
                      <div className="badge-icon">{badge.icon}</div>
                      <div className="badge-info">
                        <h3>{badge.title}</h3>
                        <p>{badge.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
