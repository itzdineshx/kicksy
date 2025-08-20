import React from 'react';
import BlurCircle from './BlurCircle';

const NewsCard = ({ news }) => {
  return (
    <div className="bg-[#111] rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-all duration-300">
      <BlurCircle />
      <img src={news.image} alt={news.title} className="w-full h-52 object-cover" />
      <div className="p-4 space-y-2">
        <p className="text-xs text-gray-400">{new Date(news.date).toDateString()}</p>
        <h3 className="text-lg font-semibold text-white">{news.title}</h3>
        <p className="text-sm text-gray-300">{news.summary}</p>

        <a
          href={news.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dull)] text-white text-sm rounded-md transition-all duration-200"
        >
          View Article
        </a>
      </div>
    </div>
  );
};

export default NewsCard;
