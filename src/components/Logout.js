import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';

const Logout = () => {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
