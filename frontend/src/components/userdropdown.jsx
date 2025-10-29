import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserDropdown = ({ user, onLogout, onProfileClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleProfileClick = () => {
    navigate('/profile'); // Profile page par navigate karo
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setIsOpen(false);
  };

  // Get initials from user name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="user-profile" ref={dropdownRef}>
      <div className="user-avatar" onClick={toggleDropdown}>
        {getInitials(user.name)}
      </div>
      
      <div className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
        <div className="dropdown-header">
          <div className="user-name">
            {user.name}
          </div>
          {/* Email removed from dropdown - only show name */}
        </div>
        
        <button 
          className="dropdown-item"
          onClick={handleProfileClick}
        >
          <span style={{ fontSize: '1.1rem' }}>👤</span>
          Profile
        </button>
        
        <div className="dropdown-divider"></div>
        
        <button 
          className="dropdown-item logout"
          onClick={handleLogoutClick}
        >
          <span style={{ fontSize: '1.1rem' }}>🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserDropdown;