import { ArrowRight } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import EventCard from './EventCard'
import { dummyShowsData } from '../data/assests'

const FeaturedSection = () => {
  const navigate = useNavigate()

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden'>
      <div className='relative flex items-center justify-between pt-20 pb-10'>
        <p className='text-gray-300 font-medium text-lg'>Live Now</p>
        <button
          onClick={() => navigate('/Events')}
          className='group flex items-center gap-2 text-sm text-gray-300 cursor-pointer'
        >
          View All
          <ArrowRight className='group-hover:translate-x-0.5 transition w-4.5 h-4.5' />
        </button>
      </div>

      <div className='grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
        {dummyShowsData.slice(0, 6).map((show) => (
          <EventCard key={show._id} event={show} />
        ))}
      </div>

      <div
        onClick={() => {
          navigate('/Events')
          window.scrollTo(0, 0)
        }}
        className='flex justify-center mt-20'
      >
        <button className='px-10 py-3 text-sm bg-[var(--color-primary)] hover:bg-[var(--color-primary-dull)] transition rounded-md font-medium cursor-pointer'>
          Show More
        </button>
      </div>
    </div>
  )
}

export default FeaturedSection
