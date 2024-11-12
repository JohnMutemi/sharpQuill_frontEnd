// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';
import Logout from './Logout';

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
    <header className="sticky bg-primaryDark text-highlight shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4">
        <div className="header__logo">
          <Link to="/" className="text-xl font-semibold text-primaryLight">
            SharpQuill Writers
          </Link>
        </div>
        <nav className="header__menu">
          <ul className="flex space-x-6">
            <li>
              <Link
                to="/"
                className="text-primaryLight hover:text-primaryAccent transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/testimonials"
                className="text-primaryLight hover:text-primaryAccent transition-colors">
                Testimonials
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li className="profile-container relative">
                  <div
                    className="profile-icon cursor-pointer"
                    onClick={handleProfileClick}>
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
                    className={`dropdown-menu absolute right-0 mt-2 bg-primaryDark text-primaryLight rounded-lg shadow-lg p-3 ${
                      showDropdown ? 'block' : 'hidden'
                    }`}>
                    <Link
                      to="/profile"
                      className="dropdown-item block px-4 py-2 hover:bg-primaryAccent transition-all">
                      Profile
                    </Link>
                    <Link
                      to="/update-profile"
                      className="dropdown-item block px-4 py-2 hover:bg-primaryAccent transition-all">
                      Update Profile
                    </Link>
                    <div
                      className="dropdown-item block px-4 py-2 hover:bg-primaryAccent transition-all cursor-pointer"
                      onClick={handleLogout}>
                      <Logout />
                    </div>
                  </div>
                </li>
              </>
            ) : (
              <li className="header__login-btn">
                <Link
                  to="/login"
                  className="text-primaryLight hover:text-primaryAccent transition-colors">
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
