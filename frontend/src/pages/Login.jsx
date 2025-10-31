import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log('Backend response:', data);
    console.log('User data:', data.user);
    console.log('Member since:', data.user?.memberSince);


      if (response.ok) {
        // Use backend user data with proper registration date
        const userData = {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          memberSince: data.user.memberSince // Backend se proper date
        };
        
        onLogin(userData, data.token);
        navigate('/dashboard');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Cannot connect to server. Please check if backend is running on port 3000');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>ThinkSync</h2>
        <p>Welcome back! Please sign in to your account.</p>
        
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
        
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        
        <div className="signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;