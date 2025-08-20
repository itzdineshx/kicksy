import React from 'react';
import BlurCircle from './BlurCircle';

const VenueCard = ({ venue }) => {
  return (
    <a
      href={venue.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div className="bg-[#111] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-all duration-300">
        <BlurCircle />
        <img
          src={venue.image}
          alt={venue.name}
          className="h-48 w-full object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white">{venue.name}</h3>
          <p className="text-sm text-gray-400 mt-1">📍 {venue.city}</p>
          <p className="text-sm text-gray-400">🏟 Capacity: {venue.capacity}</p>
        </div>
      </div>
    </a>
  );
};

export default VenueCard;
