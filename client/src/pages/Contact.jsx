import React, { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting us!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-black text-shadow-white">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 pt-30 text-[var(--color-primary)]">Contact Us</h1>
        <p className="mb-4">
          Have a question, feedback, or need help with a booking? Fill out the
          form below and we'll get back to you soon.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            required
            rows="5"
            value={form.message}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
