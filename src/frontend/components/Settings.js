import React from 'react';
import '../Styles/Settings.css'; // New CSS file for this component
import { User, Lock, Trash2 } from 'lucide-react';

export default function Settings() {
  // In a real app, you'd have state here for form inputs
  // For example: const [name, setName] = useState('Nishyanth');

  return (
    <div className="settings-content">
      <header className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account and preferences.</p>
      </header>

      <div className="settings-sections-grid">
        {/* --- Profile Section --- */}
        <div className="settings-card">
          <div className="card-header">
            <User className="card-icon" />
            <h2>Profile Information</h2>
          </div>
          <form className="settings-form">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" defaultValue="Nishyanth" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input type="email" id="email" defaultValue="nishyanth@example.com" disabled />
            </div>
            <button type="submit" className="save-btn">Save Changes</button>
          </form>
        </div>

        {/* --- Security Section --- */}
        <div className="settings-card">
          <div className="card-header">
            <Lock className="card-icon" />
            <h2>Security</h2>
          </div>
          <form className="settings-form">
            <div className="form-group">
              <label htmlFor="current-password">Current Password</label>
              <input type="password" id="current-password" placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label htmlFor="new-password">New Password</label>
              <input type="password" id="new-password" placeholder="••••••••" />
            </div>
            <button type="submit" className="save-btn">Update Password</button>
          </form>
        </div>

        {/* --- Danger Zone --- */}
        <div className="settings-card danger-zone">
            <div className="card-header">
                <Trash2 className="card-icon" />
                <h2>Danger Zone</h2>
            </div>
            <div className="danger-zone-content">
                <p>Once you delete your account, there is no going back. Please be certain.</p>
                <button className="delete-btn">Delete Your Account</button>
            </div>
        </div>
      </div>
    </div>
  );
}
