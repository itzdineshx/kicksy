import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyShowsData } from '../data/assests';
import TicketBookingModal from '../components/TicketBookingModal';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  

  // Refs for smooth scroll
  const stadiumRef = useRef(null);
  const ticketsRef = useRef(null);

  useEffect(() => {
    const selectedEvent = dummyShowsData.find(e => e._id === id);
    setEvent(selectedEvent);
  }, [id]);

  const handleConfirmBooking = (event, formData) => {
    console.log('Booking confirmed:', { event, formData });

    // Optional: save to localStorage or DB here

    // Redirect after 1s delay for smooth UX
    setTimeout(() => {
      navigate('/Bookings');
    }, 1000);
  };

  const scrollToRef = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!event) return <div className="text-white pt-32 px-10">Loading event...</div>;

  return (
    <div className="pt-32 px-6 md:px-16 lg:px-36 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* 📷 Event Image */}
        <img
          src={event.backdrop_path}
          alt={event.title}
          className="rounded-lg w-full object-cover max-h-[400px]"
        />

        {/* 📝 Event Info */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{event.title}</h1>
          <p className="text-lg text-gray-400 mb-2">{event.tagline}</p>
          <p className="text-sm text-gray-400 mb-2">{event.date} • {event.time} • {event.location}</p>

          <div className="flex gap-4 mt-4">
            {/* 🔗 View Stadium Layout: redirects to /Venues with id match */}
            <button
              onClick={() => navigate(`/Venues`)}
              className="text-blue-400 underline cursor-pointer"
            >
              View Stadium Layout
            </button>

            {/* 🔗 Browse All Tickets: redirects to /Events */}
            <button
              onClick={() => navigate('/Events')}
              className="text-blue-400 underline cursor-pointer"
            >
              Browse All Tickets
            </button>
          </div>

          {/* 🎟️ Book Tickets Button */}
          <button
            onClick={() => setShowModal(true)}
            className="mt-6 px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dull)] text-white rounded-md transition cursor-pointer"
          >
            🎟️ Book Tickets
          </button>
        </div>
      </div>


      {/* 📦 Modal */}
      {showModal && (
        <TicketBookingModal
          event={event}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
};

export default EventDetail;
