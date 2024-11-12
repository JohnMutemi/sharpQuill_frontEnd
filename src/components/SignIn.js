import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        console.log('User data received from server:', userData);

        // Store the user data in context, including their role
        login({
          username: userData.username,
          userId: userData.user_id,
          email: userData.email,
          role: userData.role,
          token: userData.access_token,
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
        console.log('Login error:', error.message);
        setError(error.message);
        setSuccess('');
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-primaryLight p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-center text-primaryDark text-2xl mb-6">Sign In</h3>

        <div className="mb-4">
          <label htmlFor="username" className="block text-primaryDark mb-2">
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 text-primaryDark bg-gray-200 border border-secondary rounded-md focus:outline-none focus:ring-2 focus:ring-primaryAccent"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primaryAccent text-primaryDark py-2 rounded-md hover:bg-highlight transition duration-300">
          Sign In
        </button>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-center mt-4">{success}</p>
        )}

        <div className="text-center mt-4 text-primaryDark">
          <p>
            Don't have an account?{' '}
            <a
              href="/register"
              className="text-primaryAccent hover:text-highlight">
              Sign Up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default SignIn;
