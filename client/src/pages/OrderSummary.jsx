import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useApp } from '../hooks/useApp'

const OrderSummary = () => {
  const { id } = useParams()
  const { bookedEvents } = useApp()
  const booking = useMemo(() => bookedEvents.find(b => b.bookingId === id), [bookedEvents, id])

  if (!booking) return <div className='px-6 md:px-16 lg:px-24 xl:px-44 pt-24'>Booking not found</div>

  const { event } = booking

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 pt-20 pb-32 print:pt-0'>
      <div className='bg-white text-black rounded-md p-6 max-w-3xl mx-auto shadow print:shadow-none print:rounded-none'>
        <h1 className='text-2xl font-bold mb-1'>Order Summary</h1>
        <p className='text-sm text-gray-600 mb-4'>Booking ID: {booking.bookingId}</p>
        <div className='flex gap-4'>
          <img src={event.backdrop_path} alt={event.title} className='w-40 h-28 object-cover rounded'/>
          <div>
            <p className='text-lg font-semibold'>{event.title}</p>
            <p className='text-sm text-gray-700'>{event.date} • {event.time} • {event.location}</p>
            {booking.seatType && <p className='text-sm mt-1'>Seat: {booking.seatType}</p>}
            {!!booking.extras?.length && <p className='text-sm'>Extras: {booking.extras.join(', ')}</p>}
          </div>
        </div>
        <div className='mt-4 text-sm'>
          <p>Name: {booking.fullName || '—'}</p>
          <p>Email: {booking.email || '—'}</p>
          <p>Phone: {booking.phone || '—'}</p>
          <p className='mt-2'>Created: {new Date(booking.createdAt).toLocaleString()}</p>
          <p>Status: {booking.isPaid ? 'Paid' : 'Pending/Offline'}</p>
        </div>
        <div className='mt-6 print:hidden'>
          <button onClick={handlePrint} className='px-4 py-2 bg-[var(--color-primary)] text-white rounded'>Print / Download</button>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary


