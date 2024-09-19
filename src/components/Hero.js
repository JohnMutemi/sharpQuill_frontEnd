import React from 'react';
import { Link } from 'react-router-dom'; 
import './Hero.css';

function Hero() {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>Achieve Your Academic Goals with Expert Help</h1>
        <p>
          Get professional writing services tailored to your needs. From essays
          to dissertations, we've got you covered.
        </p>
        <Link to="/register" className="hero-button">
          Click here to Register
        </Link>
      </div>
      <div className="hero-image">
        <img
          src="https://static.express/img/abcdq2342wfqe213rwd/hero_img.svg"
          alt="Academic Success"
        />
      </div>
    </div>
  );
}

export default Hero;
