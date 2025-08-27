import React, { useState, useEffect, useRef } from 'react';
import '../Styles/AddHabitModal.css';
import { X, Award, Book, Heart, Briefcase, Clock, Calendar as CalendarIcon } from 'lucide-react';

const presetCategories = [
  { name: 'Health', icon: <Heart size={20} /> },
  { name: 'Work', icon: <Briefcase size={20} /> },
  { name: 'Learning', icon: <Book size={20} /> },
];
const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

// Helper to format date to YYYY-MM-DD for the input
const formatDate = (date) => {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
};

const TimePicker = ({ value, onChange }) => {
    const [hour, setHour] = useState('08');
    const [minute, setMinute] = useState('30');
    const [period, setPeriod] = useState('AM');
    const hoursRef = useRef(null);
    const minutesRef = useRef(null);
    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    useEffect(() => { onChange(`${hour}:${minute} ${period}`); }, [hour, minute, period, onChange]);
    const handleScrollTo = (ref, val, list) => { if (ref.current) { const index = list.indexOf(val); ref.current.scrollTo({ top: index * 36, behavior: 'smooth' }); } };
    return (
        <div className="time-picker-container">
            <div className="time-picker-display">
                <div className="time-scroll-wheel" ref={hoursRef}>{hours.map(h => (<div key={`hour-${h}`} className={`time-option ${hour === h ? 'selected' : ''}`} onClick={() => { setHour(h); handleScrollTo(hoursRef, h, hours); }}>{h}</div>))}</div>
                <div className="time-picker-colon">:</div>
                <div className="time-scroll-wheel" ref={minutesRef}>{minutes.map(m => (<div key={`minute-${m}`} className={`time-option ${minute === m ? 'selected' : ''}`} onClick={() => { setMinute(m); handleScrollTo(minutesRef, m, minutes); }}>{m}</div>))}</div>
            </div>
            <div className="time-period"><button type="button" className={period === 'AM' ? 'selected' : ''} onClick={() => setPeriod('AM')}>AM</button><button type="button" className={period === 'PM' ? 'selected' : ''} onClick={() => setPeriod('PM')}>PM</button></div>
        </div>
    );
};

export default function AddHabitModal({ isOpen, onClose, onSave, habitToEdit }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Health');
  const [customCategory, setCustomCategory] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [frequency, setFrequency] = useState('Daily');
  const [selectedDays, setSelectedDays] = useState([]);
  const [notifications, setNotifications] = useState(false);
  const [notificationTime, setNotificationTime] = useState('08:30 AM');
  const [startDate, setStartDate] = useState(formatDate(new Date())); // New state for start date

  useEffect(() => {
    if (habitToEdit) {
      setName(habitToEdit.name);
      setFrequency(habitToEdit.frequency);
      setSelectedDays(habitToEdit.days || []);
      setNotifications(habitToEdit.notifications || false);
      setNotificationTime(habitToEdit.notificationTime || '08:30 AM');
      setStartDate(habitToEdit.startDate ? formatDate(habitToEdit.startDate) : formatDate(new Date()));

      const isPreset = presetCategories.some(p => p.name === habitToEdit.category);
      if (isPreset) {
        setIsCustom(false);
        setCategory(habitToEdit.category);
      } else {
        setIsCustom(true);
        setCategory('Other');
        setCustomCategory(habitToEdit.category);
      }
    } else {
      setName('');
      setCategory('Health');
      setCustomCategory('');
      setIsCustom(false);
      setFrequency('Daily');
      setSelectedDays([]);
      setNotifications(false);
      setStartDate(formatDate(new Date()));
    }
  }, [habitToEdit, isOpen]);

  const handleDayClick = (day) => setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  const handleCategoryClick = (catName) => { setIsCustom(false); setCategory(catName); };
  const handleOtherClick = () => { setIsCustom(true); setCategory('Other'); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    const finalCategory = isCustom ? customCategory : category;
    if (!finalCategory || (isCustom && !customCategory.trim())) return;

    onSave({
      name,
      category: finalCategory,
      frequency,
      startDate, // Include start date in saved data
      days: frequency === 'Weekly' ? selectedDays : [],
      notifications,
      notificationTime: notifications ? notificationTime : null,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{habitToEdit ? 'Edit Habit' : 'Create a New Habit'}</h2>
          <button onClick={onClose} className="close-btn"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group"><label htmlFor="habit-name">Habit Name</label><input id="habit-name" type="text" placeholder="e.g., Read for 20 minutes" value={name} onChange={(e) => setName(e.target.value)} required/></div>
          <div className="form-group"><label>Category</label><div className="category-selector">{presetCategories.map((cat) => (<button type="button" key={cat.name} className={`category-btn ${!isCustom && category === cat.name ? 'selected' : ''}`} onClick={() => handleCategoryClick(cat.name)}>{cat.icon}<span>{cat.name}</span></button>))} <button type="button" className={`category-btn ${isCustom ? 'selected' : ''}`} onClick={handleOtherClick}><Award size={20} /><span>Other</span></button></div>{isCustom && (<input type="text" placeholder="Enter your category" value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} className="custom-category-input" required/>)}</div>
          
          <div className="form-row">
            <div className="form-group">
                <label>Frequency</label>
                <div className="frequency-selector">
                    <label className={frequency === 'Daily' ? 'selected' : ''}><input type="radio" name="frequency" value="Daily" checked={frequency === 'Daily'} onChange={(e) => setFrequency(e.target.value)} />Daily</label>
                    <label className={frequency === 'Weekly' ? 'selected' : ''}><input type="radio" name="frequency" value="Weekly" checked={frequency === 'Weekly'} onChange={(e) => setFrequency(e.target.value)} />Weekly</label>
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="start-date">Start Date</label>
                <div className="date-input-wrapper">
                    <CalendarIcon size={20} />
                    <input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                </div>
            </div>
          </div>

          {frequency === 'Weekly' && (<div className="form-group day-selector-group"><label>On Which Days?</label><div className="day-selector">{daysOfWeek.map(day => (<button type="button" key={day} className={`day-btn ${selectedDays.includes(day) ? 'selected' : ''}`} onClick={() => handleDayClick(day)}>{day}</button>))}</div></div>)}
          <div className="form-group notification-group"><label>Daily Notification</label><label className="switch"><input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} /><span className="slider"></span></label></div>
          {notifications && (<div className="form-group time-picker-group"><TimePicker value={notificationTime} onChange={setNotificationTime} /></div>)}
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-save">Save Habit</button>
          </div>
        </form>
      </div>
    </div>
  );
}
