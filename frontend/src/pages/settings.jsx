import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    confirmBeforeDeleting: true,
    colorMode: 'light'
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      applyTheme(parsedSettings.colorMode);
    }
  }, []);

  // Apply theme function
  const applyTheme = (mode) => {
    const root = document.documentElement;
    
    if (mode === 'dark') {
      root.setAttribute('data-theme', 'dark');
      document.body.style.backgroundColor = '#1a1a1a';
    } else {
      root.removeAttribute('data-theme');
      document.body.style.backgroundColor = '#ffffff';
    }
  };

  // Save settings to localStorage and apply theme
  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('appSettings', JSON.stringify(newSettings));
    applyTheme(newSettings.colorMode);
  };

  const handleToggle = (setting) => {
    updateSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  const handleColorModeChange = (mode) => {
    updateSettings({
      ...settings,
      colorMode: mode
    });
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Settings</h1>
        <button className="logout-btn" onClick={handleBackToDashboard}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="notes-section">
        <div className="settings-container">
          <div className="settings-card">
            <div className="settings-section">
              <h2>General Settings</h2>
              
              <div className="setting-option">
                <div className="setting-info">
                  <h3 className="setting-title">Confirm Before Deleting</h3>
                  <p className="setting-description">
                    Show confirmation dialog when deleting notes to prevent accidental deletion
                  </p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={settings.confirmBeforeDeleting}
                    onChange={() => handleToggle('confirmBeforeDeleting')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="settings-divider"></div>

            <div className="settings-section">
              <h2>Appearance</h2>
              
              <div className="color-mode-section">
                <h3 className="setting-title">Color Mode</h3>
                <p className="setting-description">
                  Choose how ThinkSync looks to you
                </p>
                
                <div className="radio-group">
                  <div 
                    className={`radio-option ${settings.colorMode === 'light' ? 'selected' : ''}`}
                    onClick={() => handleColorModeChange('light')}
                  >
                    <div className="radio-content">
                      <div className="radio-input">
                        {settings.colorMode === 'light' && <div className="radio-dot"></div>}
                      </div>
                      <div className="radio-info">
                        <span className="radio-label">Light Mode</span>
                        <span className="radio-description">Clean white background</span>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`radio-option ${settings.colorMode === 'dark' ? 'selected' : ''}`}
                    onClick={() => handleColorModeChange('dark')}
                  >
                    <div className="radio-content">
                      <div className="radio-input">
                        {settings.colorMode === 'dark' && <div className="radio-dot"></div>}
                      </div>
                      <div className="radio-info">
                        <span className="radio-label">Dark Mode</span>
                        <span className="radio-description">Easy on the eyes in low light</span>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`radio-option ${settings.colorMode === 'system' ? 'selected' : ''}`}
                    onClick={() => handleColorModeChange('system')}
                  >
                    <div className="radio-content">
                      <div className="radio-input">
                        {settings.colorMode === 'system' && <div className="radio-dot"></div>}
                      </div>
                      <div className="radio-info">
                        <span className="radio-label">System Default</span>
                        <span className="radio-description">Match your device settings</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="settings-divider"></div>

            <div className="settings-section">
              <h2>About</h2>
              <div className="about-section">
                <div className="about-item">
                  <span className="about-label">App Version</span>
                  <span className="about-value">1.0.0</span>
                </div>
                <div className="about-item">
                  <span className="about-label">Developer</span>
                  <span className="about-value">ThinkSync Team</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;