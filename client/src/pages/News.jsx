import React from 'react';
import { newsData } from '../data/assests'
import NewsCard from '../components/NewsCard';

const News = () => {
  return (
    <section className="min-h-screen px-10 pt-30 pb-16 md:px-16 lg:px-32 bg-black text-white">
      <h1 className="text-3xl md:text-4xl font-bold mb-10">Latest Sports News 📰</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {newsData.map(news => (
          <NewsCard key={news.id} news={news} />
        ))}
      </div>
    </section>
  );
};

export default News;
