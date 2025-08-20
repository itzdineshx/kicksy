import React, { useMemo } from 'react'
import { useApp } from '../hooks/useApp'
import { useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Clock, Receipt } from 'lucide-react'

const MyBookings = () => {
  const { bookedEvents } = useApp()
  const { user } = useUser()
  const { serverBookings } = useApp()
  const combined = useMemo(() => {
    const result = [...bookedEvents]
    if (Array.isArray(serverBookings) && serverBookings.length) {
      for (const b of serverBookings) {
        if (!result.find(x => x.bookingId ? x.bookingId === b.bookingId : x._id === b._id)) {
          result.push(b)
        }
      }
    }
    return result
  }, [bookedEvents, serverBookings])

  if (!user) {
    return (
      <div className='px-6 md:px-16 lg:px-24 xl:px-44 pt-24'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-white mb-4'>My Bookings</h1>
          <p className='text-gray-400'>Please sign in to view your bookings.</p>
        </div>
      </div>
    )
  }

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 pt-20 pb-32'>
      <h1 className='text-2xl font-bold text-white mb-6'>My Bookings</h1>
      
      {combined.length === 0 ? (
        <div className='text-center py-12'>
          <div className='bg-[#111] rounded-lg p-8 max-w-md mx-auto'>
            <Receipt className='w-16 h-16 text-gray-500 mx-auto mb-4' />
            <h3 className='text-lg font-semibold text-white mb-2'>No Bookings Yet</h3>
            <p className='text-gray-400 mb-4'>You haven't made any bookings yet.</p>
            <Link 
              to='/book-tickets' 
              className='inline-block px-6 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dull)] rounded text-white font-medium'
            >
              Browse Events
            </Link>
          </div>
        </div>
      ) : (
        <div className='grid gap-6'>
          {combined.map((booking) => {
            const event = booking.event || booking
            const bookingId = booking.bookingId || booking._id
            
            return (
              <div key={bookingId} className='bg-[#111] rounded-lg p-6 border border-white/10 hover:border-white/20 transition-colors'>
                <div className='flex flex-col md:flex-row gap-6'>
                  {/* Event Image */}
                  <div className='flex-shrink-0'>
                    <img 
                      src={event.backdrop_path} 
                      alt={event.title}
                      className='w-32 h-24 object-cover rounded-lg'
                    />
                  </div>
                  
                  {/* Event Details */}
                  <div className='flex-1'>
                    <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
                      <div className='flex-1'>
                        <h3 className='text-lg font-semibold text-white mb-2'>{event.title}</h3>
                        
                        <div className='space-y-2 text-sm text-gray-300'>
                          <div className='flex items-center gap-2'>
                            <Calendar className='w-4 h-4' />
                            <span>{event.date}</span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <Clock className='w-4 h-4' />
                            <span>{event.time}</span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <MapPin className='w-4 h-4' />
                            <span>{event.location}</span>
                          </div>
                        </div>

                        {/* Booking Details */}
                        {booking.seatType && (
                          <div className='mt-3 text-sm'>
                            <span className='text-gray-400'>Seat Type: </span>
                            <span className='text-white font-medium'>{booking.seatType}</span>
                          </div>
                        )}
                        
                        {booking.extras && booking.extras.length > 0 && (
                          <div className='mt-2 text-sm'>
                            <span className='text-gray-400'>Extras: </span>
                            <span className='text-white'>{booking.extras.join(', ')}</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className='flex flex-col gap-3'>
                        <div className='text-right'>
                          <p className='text-sm text-gray-400'>Booking ID</p>
                          <p className='text-xs text-gray-500 font-mono'>{bookingId}</p>
                        </div>
                        
                        <div className='flex gap-2'>
                          <Link
                            to={`/order/${bookingId}`}
                            className='px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dull)] rounded text-white text-sm font-medium'
                          >
                            View Summary
                          </Link>
                          <button className='px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white text-sm font-medium'>
                            Download
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className='mt-4 pt-4 border-t border-white/10'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <div className={`w-2 h-2 rounded-full ${booking.isPaid ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                          <span className='text-sm text-gray-300'>
                            {booking.isPaid ? 'Paid' : 'Pending Payment'}
                          </span>
                        </div>
                        <span className='text-xs text-gray-500'>
                          Booked on {new Date(booking.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyBookings