// src/components/Services.js
import React from 'react';
import './services.css';

function Services() {
  return (
    <section className="services" id="services">
      <h2>Our Services</h2>
      <div className="service-list">
        <div className="service-item">
          <h3>Essay Writing</h3>
          <p>Professional essay writing services for all academic levels.</p>
        </div>
        <div className="service-item">
          <h3>Research Papers</h3>
          <p>In-depth research papers with thorough analysis and references.</p>
        </div>
        <div className="service-item">
          <h3>Proofreading</h3>
          <p>Detailed proofreading to ensure your work is error-free.</p>
        </div>
      </div>
    </section>
  );
}

export default Services;
