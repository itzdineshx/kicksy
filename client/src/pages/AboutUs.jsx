import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen px-6 py-12 bg-black text-shadow-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 pt-30 text-[var(--color-primary)]">About Us</h1>
        <p className="mb-4 text-lg">
          Welcome to our Sports Ticketing Platform! We are dedicated to
          bringing fans closer to the action by offering a seamless, secure, and
          enjoyable ticket booking experience for all sports lovers across
          India.
        </p>
        <p className="mb-4">
          Our mission is to simplify the way fans access live matches,
          tournaments, and special sporting events. Whether you're into cricket,
          football, kabaddi, or other thrilling sports, we've got you covered.
        </p>
        <p className="mb-4">
          Our AI Sports Chatbot also helps you find match schedules, scores, and
          helps with booking queries in real-time.
        </p>
        <p className="font-medium text-gray-700">
          Thank you for being part of our community.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
