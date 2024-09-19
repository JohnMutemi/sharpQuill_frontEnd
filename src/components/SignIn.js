import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';
import { useUser } from './UserContext';

function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    fetch('http://127.0.0.1:5555/login', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || 'Login failed');
          });
        }
        return response.json();
      })
      .then((userData) => {
        console.log('User data received from server:', userData); // Debugging statement

        // Store the user data in context, including their role
        login({
          username: userData.username,
          userId: userData.user_id,
          email: userData.email,
          role: userData.role, // Ensure role is part of the user data
          token: userData.access_token, // Ensure token is correctly named
        });

        setError('');
        setSuccess('Login successful!');

        // Redirect based on the user role
        if (userData.role === 'admin') {
          navigate('/admin-portal');
        } else if (userData.role === 'writer') {
          navigate('/writer-portal');
        } else {
          navigate('/client-portal');
        }
      })
      .catch((error) => {
        console.log('Login error:', error.message); // Debugging statement
        setError(error.message);
        setSuccess('');
      });
  };

  return (
    <div className="signin-container">
      <form onSubmit={handleSubmit} className="signin-form">
        <h3>Sign In</h3>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="signin-button">
          Sign In
        </button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <div className="signup-link">
          <p>
            Don't have an account? <a href="/register">Sign Up</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
