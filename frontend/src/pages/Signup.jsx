import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
      alert('Passwords do not match');
      return;
    }

    setLoading(true);

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
          alert('Signup successful but login failed: ' + loginData.error);
        }
      } else {
        alert(signupData.error || 'Signup failed');
      }
    } catch (error) {
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