import React, { useState } from 'react';
import YouTube from 'react-youtube';
import { PlayCircle } from 'lucide-react';

const dummyHighlights = [
  {
    id: 1,
    title: "India vs England | 5th Test Highlights",
    videourl: "yzr2rXRGJz8",
    image: "https://img.youtube.com/vi/yzr2rXRGJz8/hqdefault.jpg"
  },
  {
    id: 2,
    title: "MUN 2-2 EVE | 2025 Highlights",
    videourl: "38ktnQ4EYM0",
    image: "https://img.youtube.com/vi/38ktnQ4EYM0/hqdefault.jpg"
  },
  {
    id: 3,
    title: "West Indies v Pakistan | 2nd T20I 2025 Highlights",
    videourl: "n1hA4ivKAlY",
    image: "https://img.youtube.com/vi/n1hA4ivKAlY/hqdefault.jpg"
  },
  {
    id: 4,
    title: "WWE Summerslam | 2025 Highlights",
    videourl: "3fRMhaf50To",
    image: "https://img.youtube.com/vi/3fRMhaf50To/hqdefault.jpg"
  }
];

const HighlightsSection = () => {
  const [currentHighlights, setCurrentHighlights] = useState(dummyHighlights[0]);

  return (
    <>
      {/* Title */}
      <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-8">
        <h2 className="text-center text-2xl md:text-3xl font-semibold text-white mb-2">
          Match Highlights
        </h2>
        <p className="text-gray-300 text-lg max-w-[960px] mx-auto text-center">
          {currentHighlights.title}
        </p>
      </div>

      {/* Main video */}
      <div className="relative w-[70%] max-w-3xl h-[400px] mx-auto rounded-xl overflow-hidden shadow-lg border border-gray-700">
        <YouTube
          videoId={currentHighlights.videourl}
          className="w-full h-full"
          opts={{
            width: '100%',
            height: '100%',
            playerVars: { autoplay: 0 }
          }}
        />
      </div>


      {/* Thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 mt-10 max-w-6xl mx-auto px-4">
        {dummyHighlights.map((highlight) => {
          const isActive = currentHighlights.id === highlight.id;
          return (
            <div
              key={highlight.id}
              onClick={() => setCurrentHighlights(highlight)}
              className={`relative group cursor-pointer rounded-lg overflow-hidden shadow-md transition-all duration-300 
                ${isActive ? 'ring-2 ring-[var(--color-primary)] scale-[1.02]' : 'hover:scale-[1.03]'}
              `}
            >
              <img
                src={highlight.image}
                alt={highlight.title}
                className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-90"
              />
              
              {/* Dark gradient overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Play icon */}
              <PlayCircle
                strokeWidth={1.5}
                className="absolute top-2 left-2 w-6 h-6 md:w-10 md:h-10 text-white drop-shadow-lg"
              />

              {/* Video title (bottom overlay) */}
              <div className="absolute bottom-0 w-full bg-black/60 text-white text-xs sm:text-sm px-2 py-1 truncate">
                {highlight.title}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default HighlightsSection;
