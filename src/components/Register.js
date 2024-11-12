import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('client');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'username') setUsername(value);
    else if (name === 'password') setPassword(value);
    else if (name === 'email') setEmail(value);
    else if (name === 'role') setRole(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('email', email);
    formData.append('role', role);

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
        setRole('client');
        setTimeout(() => navigate('/login'), 1000);
      })
      .catch((error) => {
        setError(error.message);
        setSuccess('');
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-primaryLight p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-center text-primaryDark text-2xl mb-6">Register</h3>

        <div className="mb-4">
          <label htmlFor="username" className="block text-primaryDark mb-2">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 text-primaryDark bg-gray-200 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primaryAccent"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-primaryDark mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 text-primaryDark bg-gray-200 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primaryAccent"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-primaryDark mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 text-primaryDark bg-gray-200 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primaryAccent"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="role" className="block text-primaryDark mb-2">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={handleChange}
            className="w-full px-4 py-2 text-primaryDark bg-gray-200 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primaryAccent">
            <option value="client">Client</option>
            <option value="writer">Writer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-primaryAccent text-primaryDark py-2 rounded-md hover:bg-highlight transition duration-300">
          Register
        </button>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mt-4">{success}</p>
        )}

        <p className="text-center mt-4 text-primaryDark">
          Already have an account?{' '}
          <a href="/login" className="text-primaryAccent hover:text-highlight">
            Log In
          </a>
        </p>
      </form>
    </div>
  );
}

export default Register;
