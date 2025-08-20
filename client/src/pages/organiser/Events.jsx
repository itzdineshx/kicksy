import React, { useEffect, useMemo, useState } from 'react'
import OrganiserNav from '../../components/organiser/OrganiserNav'
import { organiserApi } from '../../lib/organiserApi'

const Events = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('')
  const [status, setStatus] = useState('')
  const [success, setSuccess] = useState('')
  const [editingEvent, setEditingEvent] = useState(null)

  // Enhanced mock data for better demonstration
  const mockEvents = [
    {
      id: 'evt1',
      title: 'India vs England T20 Series',
      date: '2025-02-15',
      venue: 'Wankhede Stadium, Mumbai',
      genre: 'Cricket',
      base_price: 2500,
      capacity: 50000,
      banner_url: 'https://i.pinimg.com/736x/98/2b/1e/982b1ebfc2db9551946fcad5a39a171c.jpg',
      description: 'High-octane T20 series between arch-rivals',
      is_published: true,
      bookings_count: 1250,
      revenue: 3125000,
      status: 'active'
    },
    {
      id: 'evt2',
      title: 'Pro Kabaddi League Final',
      date: '2025-02-20',
      venue: 'Sawai Mansingh Stadium, Jaipur',
      genre: 'Kabaddi',
      base_price: 1800,
      capacity: 30000,
      banner_url: 'https://i.pinimg.com/736x/77/93/30/779330f0f3795d8d32660823cd0198dc.jpg',
      description: 'PKL Season 12 Grand Finale',
      is_published: true,
      bookings_count: 890,
      revenue: 1602000,
      status: 'active'
    },
    {
      id: 'evt3',
      title: 'Hockey World Cup Qualifiers',
      date: '2025-03-10',
      venue: 'Kalinga Stadium, Bhubaneswar',
      genre: 'Hockey',
      base_price: 1200,
      capacity: 15000,
      banner_url: 'https://imgs.search.brave.com/qPabXFB6V0LJnbVmZnim1cAgnhOvnoZ_PAxi2Nu9WE8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/b2x5bXBpY3MuY29tL2ltYWdlcy9pbWFn/ZS9wcml2YXRlL3Rf/c18xNl85X2dfYXV0/by90X3Nfdzk2MC9m/X2F1dG8vcHJpbWFy/eS9mNHJpOGdsbnlv/aG1tMWo5NnV5aA',
      description: 'India hosts Hockey World Cup Qualifiers',
      is_published: true,
      bookings_count: 456,
      revenue: 547200,
      status: 'active'
    },
    {
      id: 'evt4',
      title: 'Badminton Premier League',
      date: '2025-03-25',
      venue: 'Indira Gandhi Arena, Delhi',
      genre: 'Badminton',
      base_price: 1500,
      capacity: 8000,
      banner_url: '/images/event-badminton-championship.jpg',
      description: 'Premier Badminton League Season 8',
      is_published: true,
      bookings_count: 234,
      revenue: 351000,
      status: 'active'
    },
    {
      id: 'evt5',
      title: 'Football Super Cup',
      date: '2025-04-05',
      venue: 'Salt Lake Stadium, Kolkata',
      genre: 'Football',
      base_price: 2000,
      capacity: 85000,
      banner_url: 'https://assets.khelnow.com/news/uploads/2025/08/56-East-Bengal-vs-Namdhari-copy.jpg',
      description: 'Super Cup featuring top ISL teams',
      is_published: false,
      bookings_count: 0,
      revenue: 0,
      status: 'draft'
    }
  ]

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await organiserApi.listEvents()
      if (error) throw error
      if (data && data.length > 0) {
        setEvents(data)
      } else {
        // Use mock data if no API data
        setEvents(mockEvents)
      }
    } catch (err) {
      console.error(err)
      // Fallback to mock data on error
      setEvents(mockEvents)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const remove = async (id) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return
    
    try {
      const { error } = await organiserApi.deleteEvent(id)
      if (error) throw error
      
      // Remove from local state for immediate feedback
      setEvents(prev => prev.filter(ev => ev.id !== id))
      setSuccess('✅ Event deleted successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error(err)
      setError('Failed to delete event')
    }
  }

  const togglePublishStatus = async (event) => {
    try {
      const updatedEvent = { ...event, is_published: !event.is_published }
      const { error } = await organiserApi.upsertEvent(updatedEvent)
      if (error) throw error
      
      // Update local state for immediate feedback
      setEvents(prev => prev.map(ev => 
        ev.id === event.id ? updatedEvent : ev
      ))
      
      setSuccess(`✅ Event ${updatedEvent.is_published ? 'published' : 'unpublished'} successfully!`)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error(err)
      setError('Failed to update event status')
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return events.filter(ev => {
      const matchesQuery = !q || ev.title?.toLowerCase().includes(q) || ev.venue?.toLowerCase().includes(q)
      const matchesGenre = !genre || ev.genre === genre
      const matchesStatus = !status || (status === 'published' && ev.is_published) || (status === 'draft' && !ev.is_published)
      return matchesQuery && matchesGenre && matchesStatus
    })
  }, [events, query, genre, status])

  const stats = useMemo(() => {
    const total = events.length
    const published = events.filter(ev => ev.is_published).length
    const draft = total - published
    const totalBookings = events.reduce((sum, ev) => sum + (ev.bookings_count || 0), 0)
    const totalRevenue = events.reduce((sum, ev) => sum + (ev.revenue || 0), 0)
    
    return { total, published, draft, totalBookings, totalRevenue }
  }, [events])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getGenreIcon = (genre) => {
    const icons = {
      'Cricket': '🏏',
      'Football': '⚽',
      'Hockey': '🏑',
      'Badminton': '🏸',
      'Kabaddi': '🤼',
      'Tennis': '🎾',
      'Others': '🏅'
    }
    return icons[genre] || '🏅'
  }

  return (
    <div className='min-h-screen'>
      <OrganiserNav />
      <div className='max-w-7xl mx-auto px-6 py-8 text-white'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
          <h1 className='text-2xl font-bold'>🎪 Manage Events</h1>
          <div className='flex gap-3'>
            <input 
              placeholder='🔍 Search title or venue' 
              value={query} 
              onChange={e => setQuery(e.target.value)} 
              className='bg-black/40 rounded p-2 border border-white/20 focus:border-blue-500 focus:outline-none transition-colors' 
            />
            <select 
              value={genre} 
              onChange={e => setGenre(e.target.value)} 
              className='bg-black/40 rounded p-2 border border-white/20 focus:border-blue-500 focus:outline-none transition-colors'
            >
              <option value=''>All Genres</option>
              <option value='Cricket'>🏏 Cricket</option>
              <option value='Football'>⚽ Football</option>
              <option value='Hockey'>🏑 Hockey</option>
              <option value='Badminton'>🏸 Badminton</option>
              <option value='Kabaddi'>🤼 Kabaddi</option>
              <option value='Tennis'>🎾 Tennis</option>
              <option value='Others'>🏅 Others</option>
            </select>
            <select 
              value={status} 
              onChange={e => setStatus(e.target.value)} 
              className='bg-black/40 rounded p-2 border border-white/20 focus:border-blue-500 focus:outline-none transition-colors'
            >
              <option value=''>All Status</option>
              <option value='published'>✅ Published</option>
              <option value='draft'>📝 Draft</option>
            </select>
            <a 
              href='/organiser/create-event' 
              className='px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dull)] rounded text-sm font-medium transition-colors'
            >
              ➕ Create Event
            </a>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid md:grid-cols-5 gap-4 mb-6'>
          <div className='bg-[#111] rounded-lg p-4 border border-white/10'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-400'>Total Events</p>
                <p className='text-2xl font-bold text-blue-400'>{stats.total}</p>
              </div>
              <span className='text-2xl'>🎪</span>
            </div>
          </div>
          <div className='bg-[#111] rounded-lg p-4 border border-white/10'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-400'>Published</p>
                <p className='text-2xl font-bold text-green-400'>{stats.published}</p>
              </div>
              <span className='text-2xl'>✅</span>
            </div>
          </div>
          <div className='bg-[#111] rounded-lg p-4 border border-white/10'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-400'>Drafts</p>
                <p className='text-2xl font-bold text-yellow-400'>{stats.draft}</p>
              </div>
              <span className='text-2xl'>📝</span>
            </div>
          </div>
          <div className='bg-[#111] rounded-lg p-4 border border-white/10'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-400'>Total Bookings</p>
                <p className='text-2xl font-bold text-purple-400'>{stats.totalBookings.toLocaleString()}</p>
              </div>
              <span className='text-2xl'>🎫</span>
            </div>
          </div>
          <div className='bg-[#111] rounded-lg p-4 border border-white/10'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-400'>Revenue</p>
                <p className='text-2xl font-bold text-green-400'>₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
              </div>
              <span className='text-2xl'>💰</span>
            </div>
          </div>
        </div>

        {error && (
          <div className='bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6'>
            <p className='text-red-400'>{error}</p>
          </div>
        )}

        {success && (
          <div className='bg-green-900/20 border border-green-500/50 rounded-lg p-4 mb-6'>
            <p className='text-green-400'>{success}</p>
          </div>
        )}

        {loading ? (
          <div className='flex items-center justify-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
          </div>
        ) : (
          <div className='overflow-x-auto bg-[#111] rounded-lg p-6 border border-white/10'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-white/10'>
                  <th className='text-left py-3 px-2'>Event</th>
                  <th className='text-left py-3 px-2'>Date</th>
                  <th className='text-left py-3 px-2'>Venue</th>
                  <th className='text-left py-3 px-2'>Genre</th>
                  <th className='text-left py-3 px-2'>Price</th>
                  <th className='text-left py-3 px-2'>Bookings</th>
                  <th className='text-left py-3 px-2'>Revenue</th>
                  <th className='text-left py-3 px-2'>Status</th>
                  <th className='text-right py-3 px-2'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(ev => (
                  <tr key={ev.id} className='border-b border-white/5 hover:bg-black/20 transition-colors'>
                    <td className='py-3 px-2'>
                      <div className='flex items-center gap-3'>
                        {ev.banner_url && (
                          <img 
                            src={ev.banner_url} 
                            alt={ev.title}
                            className='w-12 h-8 object-cover rounded'
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        )}
                        <div>
                          <p className='font-medium text-sm'>{ev.title}</p>
                          <p className='text-xs text-gray-400'>{ev.description?.substring(0, 50)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className='py-3 px-2'>
                      <div className='text-sm'>{formatDate(ev.date)}</div>
                      <div className='text-xs text-gray-400'>{ev.date}</div>
                    </td>
                    <td className='py-3 px-2'>
                      <div className='text-sm'>{ev.venue}</div>
                      <div className='text-xs text-gray-400'>Capacity: {ev.capacity?.toLocaleString()}</div>
                    </td>
                    <td className='py-3 px-2'>
                      <div className='flex items-center gap-2'>
                        <span className='text-lg'>{getGenreIcon(ev.genre)}</span>
                        <span className='text-sm'>{ev.genre}</span>
                      </div>
                    </td>
                    <td className='py-3 px-2'>
                      <div className='text-sm font-medium text-green-400'>₹{ev.base_price?.toLocaleString()}</div>
                    </td>
                    <td className='py-3 px-2'>
                      <div className='text-sm'>{ev.bookings_count?.toLocaleString() || 0}</div>
                      <div className='text-xs text-gray-400'>
                        {ev.capacity ? Math.round((ev.bookings_count || 0) / ev.capacity * 100) : 0}% full
                      </div>
                    </td>
                    <td className='py-3 px-2'>
                      <div className='text-sm font-medium text-yellow-400'>₹{(ev.revenue / 1000).toFixed(0)}K</div>
                    </td>
                    <td className='py-3 px-2'>
                      <span className={`px-2 py-1 rounded text-xs ${
                        ev.is_published 
                          ? 'bg-green-600/30 text-green-300 border border-green-500/30' 
                          : 'bg-yellow-600/30 text-yellow-300 border border-yellow-500/30'
                      }`}>
                        {ev.is_published ? '✅ Published' : '📝 Draft'}
                      </span>
                    </td>
                    <td className='py-3 px-2 text-right'>
                      <div className='flex gap-2 justify-end'>
                        <button 
                          onClick={() => togglePublishStatus(ev)}
                          className={`px-3 py-1 rounded text-xs transition-colors ${
                            ev.is_published 
                              ? 'bg-yellow-600/30 text-yellow-300 hover:bg-yellow-600/50' 
                              : 'bg-green-600/30 text-green-300 hover:bg-green-600/50'
                          }`}
                        >
                          {ev.is_published ? '📝 Unpublish' : '🚀 Publish'}
                        </button>
                        <a 
                          href={`/organiser/create-event?id=${ev.id}`}
                          className='px-3 py-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dull)] rounded text-xs transition-colors'
                        >
                          ✏️ Edit
                        </a>
                        <button 
                          onClick={() => remove(ev.id)} 
                          className='px-3 py-1 bg-red-600/30 hover:bg-red-600/50 text-red-300 rounded text-xs transition-colors'
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className='text-center text-gray-500 py-12'>
                <div className='w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center'>
                  <span className='text-2xl'>🎪</span>
                </div>
                <p className='text-lg mb-2'>No events found</p>
                <p className='text-sm text-gray-400'>Try adjusting your search criteria or create a new event</p>
                <a 
                  href='/organiser/create-event'
                  className='inline-block mt-4 px-6 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dull)] rounded text-sm font-medium transition-colors'
                >
                  ➕ Create Your First Event
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Events
