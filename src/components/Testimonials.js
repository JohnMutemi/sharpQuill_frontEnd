import React from 'react';

function Testimonials() {
  return (
    <section className="bg-primaryLight py-12" id="testimonials">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-semibold text-primaryDark mb-8">
          What Our Clients Say
        </h2>
        <div className="testimonial-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="testimonial-item bg-white p-6 rounded-lg shadow-lg">
            <p className="text-secondary text-lg italic mb-4">
              "Kisinga Solutions has been a lifesaver! The writers are top-notch
              and always deliver on time."
            </p>
            <h3 className="text-primaryDark font-bold">- John Doe</h3>
          </div>
          <div className="testimonial-item bg-white p-6 rounded-lg shadow-lg">
            <p className="text-secondary text-lg italic mb-4">
              "I have used many academic writing services, but Kisinga Solutions
              is by far the best."
            </p>
            <h3 className="text-primaryDark font-bold">- Jane Smith</h3>
          </div>
          <div className="testimonial-item bg-white p-6 rounded-lg shadow-lg">
            <p className="text-secondary text-lg italic mb-4">
              "Excellent service and support. Highly recommend!"
            </p>
            <h3 className="text-primaryDark font-bold">- Mark Johnson</h3>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
