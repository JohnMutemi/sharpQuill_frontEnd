import React from 'react';
import './Testimonials.css';

function Testimonials() {
  return (
    <section className="testimonials" id="testimonials">
      <h2>What Our Clients Say</h2>
      <div className="testimonial-list">
        <div className="testimonial-item">
          <p>
            "Kisinga Solutions has been a lifesaver! The writers are top-notch
            and always deliver on time."
          </p>
          <h3>- John Doe</h3>
        </div>
        <div className="testimonial-item">
          <p>
            "I have used many academic writing services, but Kisinga Solutions
            is by far the best."
          </p>
          <h3>- Jane Smith</h3>
        </div>
        <div className="testimonial-item">
          <p>"Excellent service and support. Highly recommend!"</p>
          <h3>- Mark Johnson</h3>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
