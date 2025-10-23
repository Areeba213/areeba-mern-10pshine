import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    confirmBeforeDeleting: false,
    colorMode: 'light'
  });

  // Load settings from localStorage - sirf ek baar
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
    }
  }, []); // Empty dependency - sirf component mount par

  // Apply theme function
  const applyTheme = (mode) => {
    const root = document.documentElement;
    
    if (mode === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else if (mode === 'light') {
      root.removeAttribute('data-theme');
    } else {
      // System mode
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.setAttribute('data-theme', 'dark');
      } else {
        root.removeAttribute('data-theme');
      }
    }
  };

  // Save settings to localStorage aur theme apply karo
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
        <button className="back-btn" onClick={handleBackToDashboard}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="notes-section">
        <div className="settings-container">
          <div className="settings-card">
            <div className="settings-section">
              <h2>General</h2>
              
              <div className="setting-option">
                <div className="setting-info">
                  <div className="setting-title">Confirm before deleting</div>
                  <div className="setting-description">
                    Show confirmation dialog when deleting notes
                  </div>
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
              <h2>Color</h2>
              
              <div className="radio-group">
                <div 
                  className="radio-option"
                  onClick={() => handleColorModeChange('light')}
                >
                  <div className={`radio-input ${settings.colorMode === 'light' ? 'checked' : ''}`}>
                    {settings.colorMode === 'light' && <div className="radio-dot"></div>}
                  </div>
                  <span className="radio-label">Light</span>
                </div>

                <div 
                  className="radio-option"
                  onClick={() => handleColorModeChange('dark')}
                >
                  <div className={`radio-input ${settings.colorMode === 'dark' ? 'checked' : ''}`}>
                    {settings.colorMode === 'dark' && <div className="radio-dot"></div>}
                  </div>
                  <span className="radio-label">Dark</span>
                </div>

                <div 
                  className="radio-option"
                  onClick={() => handleColorModeChange('system')}
                >
                  <div className={`radio-input ${settings.colorMode === 'system' ? 'checked' : ''}`}>
                    {settings.colorMode === 'system' && <div className="radio-dot"></div>}
                  </div>
                  <span className="radio-label">Use my Windows mode</span>
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