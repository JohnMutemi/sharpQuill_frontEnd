// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';
import Logout from './Logout';
import './Header.css';

const Header = () => {
  const { isAuthenticated } = useUser();
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {
    setShowDropdown(false); // Hide dropdown on logout
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header__logo">
          <Link to="/">SharpQuill Writers</Link>
        </div>
        <nav className="header__menu">
          <ul className="header__menu-items">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/testimonials">Testimonials</Link>
            </li>

            {isAuthenticated ? (
              <>
                <li className="profile-container">
                  <div className="profile-icon" onClick={handleProfileClick}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="8" r="4" fill="#ffffff" />
                      <path
                        d="M4 20c0-4.418 3.582-8 8-8s8 3.582 8 8"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div
                    className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
                    <Link to="/profile" className="dropdown-item">
                      Profile
                    </Link>
                    <Link to="/update-profile" className="dropdown-item">
                      Update Profile
                    </Link>
                    <div
                      className="dropdown-item logout-button"
                      onClick={handleLogout}>
                      <Logout />
                    </div>
                  </div>
                </li>
              </>
            ) : (
              <li className="header__login-btn">
                <Link to="/login" className="login-btn__text">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
