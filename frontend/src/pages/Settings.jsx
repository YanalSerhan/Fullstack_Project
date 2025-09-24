import React, { useState, useEffect } from 'react';
import './settings.css';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [messages, setMessages] = useState({ success: '', error: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      // Check if user is a guest first
      const authData = JSON.parse(localStorage.getItem("auth") || '{}');
      if (authData.isGuest) {
        // Redirect guests back to home
        window.location.href = "#home";
        return;
      }

      // Get user data from localStorage or sessionStorage (same as Home component)
      const userData = localStorage.getItem("user") || sessionStorage.getItem("user");
      
      if (!userData) {
        setMessages({ error: 'User not authenticated' });
        return;
      }

      const user = JSON.parse(userData);
      
      // Get fresh user data from the API
      const response = await fetch(`http://localhost:3000/api/users/profile?userId=${user.userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          setProfileForm({
            firstName: data.user.firstName || '',
            lastName: data.user.lastName || '',
            email: data.user.email || ''
          });
        } else {
          // Fallback to localStorage data if API fails
          setUser(user);
          setProfileForm({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || ''
          });
        }
      } else {
        // Fallback to localStorage data if API fails
        setUser(user);
        setProfileForm({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || ''
        });
      }
    } catch (error) {
      // Fallback to localStorage data if API fails
      const userData = localStorage.getItem("user") || sessionStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUser(user);
        setProfileForm({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || ''
        });
      } else {
        setMessages({ error: 'Failed to load user profile' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessages({ success: '', error: '' });

    try {
      const userData = localStorage.getItem("user") || sessionStorage.getItem("user");
      const user = JSON.parse(userData);

      // Debug log to see what we're sending
      console.log('Settings - user data:', user);

      const response = await fetch('http://localhost:3000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          ...profileForm,
          userId: user.userId
        })
      });

      const data = await response.json();

      if (data.success) {
        // Update localStorage with new user data
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setMessages({ success: 'Profile updated successfully!' });
      } else {
        setMessages({ error: data.error || 'Failed to update profile' });
      }
    } catch (error) {
      setMessages({ error: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessages({ success: '', error: '' });

    // Client-side validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessages({ error: 'New passwords do not match' });
      setIsSubmitting(false);
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setMessages({ error: 'New password must be at least 8 characters long' });
      setIsSubmitting(false);
      return;
    }

    try {
      const userData = localStorage.getItem("user") || sessionStorage.getItem("user");
      const user = JSON.parse(userData);

      // Debug log to see what we're sending
      console.log('Password change - user data:', user);

      const response = await fetch('http://localhost:3000/api/users/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          userId: user.userId
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessages({ success: 'Password changed successfully!' });
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessages({ error: data.error || 'Failed to change password' });
      }
    } catch (error) {
      setMessages({ error: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'profile') {
      setProfileForm(prev => ({ ...prev, [name]: value }));
    } else if (formType === 'password') {
      setPasswordForm(prev => ({ ...prev, [name]: value }));
      
      // Update password strength when new password changes
      if (name === 'newPassword') {
        setPasswordStrength(calculatePasswordStrength(value));
      }
    }
  };

  if (loading) {
    return (
      <div className="settings-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="settings-container">
        <div className="error">Please log in to access settings.</div>
      </div>
    );
  }

  return (
    <div className="settings-container">
      <div className="settings-header">
        <div className="header-top">
          <button 
            onClick={() => window.location.href = "#home"} 
            className="back-button"
          >
            ← Back to Home
          </button>
        </div>
        <h1>User Settings</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="settings-content">
        <div className="settings-sidebar">
          <button 
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Information
          </button>
          <button 
            className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            Change Password
          </button>
        </div>

        <div className="settings-main">
          {messages.success && (
            <div className="message success">{messages.success}</div>
          )}
          {messages.error && (
            <div className="message error">{messages.error}</div>
          )}

          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2>Profile Information</h2>
              <form onSubmit={handleProfileSubmit} className="settings-form">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={profileForm.firstName}
                    onChange={(e) => handleInputChange(e, 'profile')}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={profileForm.lastName}
                    onChange={(e) => handleInputChange(e, 'profile')}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileForm.email}
                    onChange={(e) => handleInputChange(e, 'profile')}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="settings-section">
              <h2>Change Password</h2>
              <form onSubmit={handlePasswordSubmit} className="settings-form">
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={(e) => handleInputChange(e, 'password')}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={(e) => handleInputChange(e, 'password')}
                    required
                    minLength="8"
                  />
                  {passwordForm.newPassword && (
                    <div className="password-strength">
                      <div className="strength-bar">
                        <div 
                          className={`strength-fill strength-${passwordStrength}`}
                        ></div>
                      </div>
                      <small className="strength-text">
                        {passwordStrength === 0 && 'Very Weak'}
                        {passwordStrength === 1 && 'Weak'}
                        {passwordStrength === 2 && 'Fair'}
                        {passwordStrength === 3 && 'Good'}
                        {passwordStrength === 4 && 'Strong'}
                        {passwordStrength === 5 && 'Very Strong'}
                      </small>
                    </div>
                  )}
                  <small>Password must be at least 8 characters long</small>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => handleInputChange(e, 'password')}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Changing Password...' : 'Change Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
