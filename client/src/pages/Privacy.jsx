import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen px-6 py-12 bg-black text-shadow-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 pt-30 text-[var(--color-primary)]">Privacy Policy</h1>
        <p className="mb-4">
          We value your privacy and are committed to protecting your personal
          information. This Privacy Policy explains how we collect, use, and
          safeguard your data.
        </p>

        <h2 className="text-lg font-semibold mt-6 mb-2">Information We Collect</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Your name and contact information when you sign up or contact us</li>
          <li>Booking history and preferences</li>
          <li>Chat interactions for improving services</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-2">How We Use Your Information</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>To manage bookings and ticketing</li>
          <li>To personalize your experience</li>
          <li>To improve our chatbot and website performance</li>
        </ul>

        <h2 className="text-lg font-semibold mt-6 mb-2">Your Rights</h2>
        <p className="mb-4">
          You can request to access, correct, or delete your data at any time by
          contacting us.
        </p>

        <p className="text-sm text-gray-500">
          Last updated: August 8, 2025
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
