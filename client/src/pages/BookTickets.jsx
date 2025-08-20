import React, { useMemo, useState } from 'react'
import { dummyShowsData } from '../data/assests'
import EventCard from '../components/EventCard'

const BookTickets = () => {
  const [q, setQ] = useState('')
  const [genre, setGenre] = useState('')
  const [sort, setSort] = useState('date-asc')
  const filtered = useMemo(() => {
    let list = [...dummyShowsData]
    if (q) list = list.filter(e => e.title.toLowerCase().includes(q.toLowerCase()))
    if (genre) list = list.filter(e => (e.genre || '').toLowerCase() === genre)
    list.sort((a,b) => {
      if (sort === 'date-asc') return a.date.localeCompare(b.date)
      if (sort === 'date-desc') return b.date.localeCompare(a.date)
      if (sort === 'rating-desc') return (b.vote_average||0) - (a.vote_average||0)
      return 0
    })
    return list
  }, [q, genre, sort])

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 pt-20 pb-32'>
      <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6'>
        <h1 className='text-2xl font-bold text-white'>Book Tickets</h1>
        <div className='flex flex-wrap gap-3'>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder='Search' className='bg-white/10 text-white px-3 py-2 rounded'/>
          <select value={genre} onChange={e=>setGenre(e.target.value)} className='bg-white/10 text-white px-3 py-2 rounded'>
            <option value=''>All Genres</option>
            <option value='cricket'>Cricket</option>
            <option value='football'>Football</option>
            <option value='hockey'>Hockey</option>
            <option value='kabaddi'>Kabaddi</option>
            <option value='badminton'>Badminton</option>
            <option value='others'>Others</option>
          </select>
          <select value={sort} onChange={e=>setSort(e.target.value)} className='bg-white/10 text-white px-3 py-2 rounded'>
            <option value='date-asc'>Date ↑</option>
            <option value='date-desc'>Date ↓</option>
            <option value='rating-desc'>Rating ↓</option>
          </select>
        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {filtered.map((e) => (
          <EventCard key={e._id} event={e} />
        ))}
      </div>
    </div>
  )
}

export default BookTickets