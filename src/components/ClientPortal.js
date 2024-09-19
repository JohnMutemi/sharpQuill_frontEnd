import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './ClientPortal.css';
import PostAssignment from './PostAssignment';
import ProfileUpdate from './ProfileUpdate';
import { useUser } from './UserContext'; // Import the updated UserContext
import Logout from './Logout'; // Import the Logout component

const ClientPortal = () => {
  const { user, isAuthenticated } = useUser(); // Destructure user and isAuthenticated from context
  const [showPostAssignment, setShowPostAssignment] = useState(false);
  const [showProfileUpdate, setShowProfileUpdate] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  // Redirect to login page if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      console.warn('User not authenticated, redirecting to login page.');
      navigate('/login'); // Use navigate instead of window.location.href
    }
  }, [isAuthenticated, navigate]);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="client-portal-container">
      <div className="header">
        <h1>Welcome, {user?.username}!</h1>
        <div className="header-buttons">
          <div className="profile-icon" onClick={handleProfileClick}></div>
          <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
            <div className="dropdown-item">
              <h3>Profile Bio</h3>
              <p>{user?.bio || 'Display user bio here'}</p>{' '}
              {/* Optionally display bio */}
            </div>
            <div
              className="dropdown-item"
              onClick={() => setShowProfileUpdate(!showProfileUpdate)}>
              Update Profile
            </div>

            {/* Conditionally render Logout or Login button based on isAuthenticated */}
            <div className="dropdown-item">
              {isAuthenticated ? (
                <Logout /> // Show Logout if user is authenticated
              ) : (
                <button
                  className="login-button"
                  onClick={() => navigate('/login')} // Use navigate to go to login page
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        className="toggle-post-assignment"
        onClick={() => setShowPostAssignment(!showPostAssignment)}>
        {showPostAssignment ? 'Hide Post Assignment' : 'Post a New Assignment'}
      </button>

      {showPostAssignment && <PostAssignment user_id={user?.userId} />}
      {showProfileUpdate && <ProfileUpdate />}
    </div>
  );
};

export default ClientPortal;
