import React from 'react';

function Footer() {
  return (
    <footer className="bg-primaryDark text-primaryLight py-4 mt-8 fixed bottom-0 w-full">
      <div className="footer-content container mx-auto flex justify-between items-center px-6">
        <p>&copy; 2024 Scholar Solutions. All rights reserved.</p>
        <div className="social-media space-x-4">
          <a
            href="#facebook"
            className="text-highlight hover:text-primaryAccent">
            Facebook
          </a>
          <a
            href="#twitter"
            className="text-highlight hover:text-primaryAccent">
            Twitter
          </a>
          <a
            href="#instagram"
            className="text-highlight hover:text-primaryAccent">
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
