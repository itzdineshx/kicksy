import React from 'react';
import { venuesData } from '../data/assests';
import VenueCard from '../components/VenueCard';

const Venues = () => {
  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 pt-30 pb-32">
      <h1 className="text-2xl font-bold text-white mb-6">Popular Venues in India</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {venuesData.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>
    </div>
  );
};

export default Venues;
