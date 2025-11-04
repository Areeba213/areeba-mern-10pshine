import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logger from '../utils/logger';

const Signup = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      logger.warn('Password mismatch during signup', { email });
      alert('Passwords do not match');
      return;
    }

    setLoading(true);
    logger.info('Signup attempt', { email, name });

    try {
      // Signup request
      const signupResponse = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const signupData = await signupResponse.json();

      if (signupResponse.ok) {
        logger.info('Signup successful', { email, name });
        
        // Auto login after signup
        const loginResponse = await fetch('http://localhost:3000/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const loginData = await loginResponse.json();

        if (loginResponse.ok) {
          logger.info('Auto-login after signup successful', { 
            userId: loginData.user.id, 
            email 
          });
          
          // Use backend user data with proper registration date
          const userData = {
            id: loginData.user.id,
            name: loginData.user.name,
            email: loginData.user.email,
            memberSince: loginData.user.memberSince // Backend se proper date
          };
          
          onLogin(userData, loginData.token);
          navigate('/dashboard');
        } else {
          logger.error('Auto-login failed after signup', { 
            email, 
            error: loginData.error 
          });
          alert('Signup successful but login failed: ' + loginData.error);
        }
      } else {
        logger.warn('Signup failed', { 
          email, 
          error: signupData.error 
        });
        alert(signupData.error || 'Signup failed');
      }
    } catch (error) {
      logger.error('Signup error', { 
        email, 
        error: error.message 
      });
      alert('Network error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>ThinkSync</h2>
        <p>Create your account to get started.</p>
        
        <div className="form-group">
          <input
            type="text"
            className="form-input"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <input
            type="email"
            className="form-input"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="form-group">
          <input
            type="password"
            className="form-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            className="form-input"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
        
        <div className="signup-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;