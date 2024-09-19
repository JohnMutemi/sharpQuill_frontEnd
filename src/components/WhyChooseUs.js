// src/components/WhyChooseUs.js
import React from 'react';
import './WhyChooseUs.css';

function WhyChooseUs() {
  return (
    <section className="why-choose-us" id="why-choose-us">
      <h2>Why Choose Us</h2>
      <div className="benefits-list">
        <div className="benefit-item">
          <h3>Professional Writers</h3>
          <p>Our team consists of experienced and qualified writers.</p>
        </div>
        <div className="benefit-item">
          <h3>Timely Delivery</h3>
          <p>We ensure all assignments are delivered on time.</p>
        </div>
        <div className="benefit-item">
          <h3>24/7 Support</h3>
          <p>Our support team is available around the clock.</p>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
