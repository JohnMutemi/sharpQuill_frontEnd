import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('client'); // New state for role selection
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    else if (name === 'password') setPassword(value);
    else if (name === 'email') setEmail(value);
    else if (name === 'role') setRole(value); // Handle role change
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('email', email);
    formData.append('role', role); // Append selected role to the form data

    fetch('http://127.0.0.1:5555/register', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || 'Registration failed');
          });
        }
        return response.json();
      })
      .then((data) => {
        setSuccess(data.message);
        setError('');
        setUsername('');
        setPassword('');
        setEmail('');
        setRole('client'); // Reset role to default after success

        setTimeout(() => navigate('/login'), 1000); // Navigate to login page after success
      })
      .catch((error) => {
        setError(error.message);
        setSuccess('');
      });
  };

  return (
    <div className="signin-container">
      <form onSubmit={handleSubmit} className="signin-form">
        <h3>Register</h3>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            placeholder="Username"
            value={username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="role">Role</label>
          <select id="role" name="role" value={role} onChange={handleChange}>
            <option value="client">Client</option>
            <option value="writer">Writer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="signin-button">
          Register
        </button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <p className="signin-link">
          Already have an account? <a href="/login">Log In</a>
        </p>
      </form>
    </div>
  );
}

export default Register;
