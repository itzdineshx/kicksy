import { Star, MapPin, ShoppingCart } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlurCircle from './BlurCircle';
import { useApp } from '../hooks/useApp';
import TicketBookingModal from './TicketBookingModal'; 
import { useUser } from '@clerk/clerk-react';

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const { cartItems, toggleCart, addBooking } = useApp();
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);

  const isInCart = cartItems.some(item => item._id === event._id);

  const handleCardClick = () => {
    navigate(`/Events/${event._id}`);
    scrollTo(0, 0);
  };

  const openModal = (e) => {
    e.stopPropagation(); 
    setShowModal(true);
  };

  return (
    <>
      {/* Event Card */}
      <div
        onClick={handleCardClick}
        className="bg-[#111] rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl p-3 group w-full max-w-xs mx-auto relative"
      >
        <BlurCircle />

        {/* Action Icons */}
        <div className="absolute top-3 right-3 flex gap-2 z-10">
          {/* Cart Icon */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              toggleCart(event);
            }}
            className="p-1.5 rounded-full bg-black/60 hover:bg-black text-white transition-all cursor-pointer"
          >
            <ShoppingCart className={`w-4 h-4 ${isInCart ? 'fill-blue-500 text-[var(--color-primary)]' : ''}`} />
          </div>
        </div>

        {/* Image */}
        <div className="relative">
          <BlurCircle/>
          <img
            src={event.backdrop_path}
            alt={event.title}
            className="rounded-lg h-48 w-full object-cover group-hover:opacity-90 transition"
          />
          <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-xs font-semibold text-white">
            {event?.tagline || 'Live Event'}
          </div>
        </div>

        {/* Details */}
        <div className="mt-3 flex flex-col flex-grow">
          <h3 className="text-base font-semibold text-white leading-snug truncate">
            {event.title}
          </h3>

          <p className="text-sm text-gray-400 mt-1">
            {event.date} • {event.time}
          </p>

          <div className="flex items-center gap-1 text-xs text-gray-300 mt-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            {event.location || 'India'}
          </div>

          <div className="flex items-center justify-between mt-4">
            {/* Buy Tickets opens modal */}
            <button
              onClick={openModal}
              className="px-4 py-1.5 text-sm font-medium rounded-full bg-[var(--color-primary)] hover:bg-[[var(--color-primary-dull)] transition text-white cursor-pointer"
            >
              Buy Tickets
            </button>
          </div>
        </div>
      </div>

      {/* Ticket Booking Modal */}
      {showModal && (
        <TicketBookingModal
          event={event}
          onClose={() => setShowModal(false)}
          onConfirm={(event, formData) => {
            addBooking(event, user?.id, formData);
            setShowModal(false);
          }}
        />
      )}
    </>
  );
};

export default EventCard;
