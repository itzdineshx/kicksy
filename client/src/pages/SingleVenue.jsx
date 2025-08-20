import { useParams } from 'react-router-dom';
import { venuesData } from '../data/assests'; // or fetch from API

const SingleVenue = () => {
  const { id } = useParams();
  const venue = venuesData.find(v => v.id === id); // match with your id

  if (!venue) return <p className="text-white pt-32 px-10">Venue not found</p>;

  return (
    <div className="pt-32 px-6 md:px-16 lg:px-24 pb-20 text-white">
      <h1 className="text-3xl font-bold mb-4">{venue.name}</h1>
      <img src={venue.image} className="rounded-lg mb-6" />
      <p className="text-gray-400">{venue.location}</p>
      <p className="text-gray-500 mt-2">Capacity: {venue.capacity}</p>
    </div>
  );
};
