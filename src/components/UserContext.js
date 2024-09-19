import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the UserContext
const UserContext = createContext();

// Provider component that wraps your app and makes user state available to any child component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // State for storing user data
  const [token, setToken] = useState(null); // State for storing token
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication flag

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const storedToken = localStorage.getItem('token');

      console.log('Retrieved user:', storedUser); // Debugging statement
      console.log('Retrieved token:', storedToken); // Debugging statement

      if (storedUser && storedToken) {
        setUser(storedUser);
        setToken(storedToken);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error retrieving user or token from localStorage:', error);
    }
  }, []);

  // Login function to set the user data, token, and persist them in localStorage
  const login = (userData) => {
    console.log('User data received in login:', userData); // Debugging statement
    console.log('Storing token:', userData.token); // Debugging statement

    try {
      if (userData && userData.token) {
        setUser(userData);
        setToken(userData.token);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData.token);
      } else {
        console.error('Invalid user data:', userData);
      }
    } catch (error) {
      console.error('Error storing user or token in localStorage:', error);
    }
  };

  // Logout function to clear user data, token, and remove them from localStorage
  const logout = () => {
    setUser(null); // Clear user state
    setToken(null); // Clear token
    setIsAuthenticated(false); // Set authentication flag to false

    try {
      localStorage.removeItem('user'); // Remove user data from localStorage
      localStorage.removeItem('token'); // Remove token from localStorage
    } catch (error) {
      console.error('Error removing user or token from localStorage:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to consume the UserContext
export const useUser = () => useContext(UserContext);
