import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const OrganiserNav = () => {
  const location = useLocation()
  const item = (to, label) => (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === to ? 'bg-white/10 text-white' : 'text-gray-300 hover:text-white hover:bg-white/5'}`}
    >
      {label}
    </Link>
  )
  return (
    <div className='w-full bg-black/70 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
        <Link to='/organiser' className='text-white font-semibold'>Organiser</Link>
        <nav className='flex gap-2'>
          {item('/organiser', 'Dashboard')}
          {item('/organiser/events', 'Events')}
          {item('/organiser/events/new', 'Create Event')}
          {item('/organiser/bookings', 'Bookings')}
        </nav>
      </div>
    </div>
  )
}

export default OrganiserNav
