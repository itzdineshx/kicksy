import React, { useEffect, useMemo, useState } from 'react'
import OrganiserNav from '../../components/organiser/OrganiserNav'
import { organiserApi } from '../../lib/organiserApi'

const Bookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [status, setStatus] = useState('')
  const [genre, setGenre] = useState('')
  const [query, setQuery] = useState('')

  // Enhanced mock data for better demonstration
  const mockBookings = [
    {
      id: 'book1',
      created_at: '2025-01-30T10:30:00Z',
      amount: 5000,
      payload: { 
        genre: 'Cricket', 
        event_title: 'India vs England T20 Series',
        customer_name: 'Rahul Sharma',
        customer_email: 'rahul.sharma@email.com',
        seats: ['A15', 'A16'],
        event_date: '2025-02-15'
      },
      status: 'confirmed',
      payment_method: 'Credit Card',
      transaction_id: 'TXN_001234'
    },
    {
      id: 'book2',
      created_at: '2025-01-29T15:45:00Z',
      amount: 3600,
      payload: { 
        genre: 'Kabaddi', 
        event_title: 'Pro Kabaddi League Final',
        customer_name: 'Priya Patel',
        customer_email: 'priya.patel@email.com',
        seats: ['B22', 'B23'],
        event_date: '2025-02-20'
      },
      status: 'confirmed',
      payment_method: 'UPI',
      transaction_id: 'TXN_001235'
    },
    {
      id: 'book3',
      created_at: '2025-01-28T09:15:00Z',
      amount: 2400,
      payload: { 
        genre: 'Hockey', 
        event_title: 'Hockey World Cup Qualifiers',
        customer_name: 'Amit Kumar',
        customer_email: 'amit.kumar@email.com',
        seats: ['C10', 'C11'],
        event_date: '2025-03-10'
      },
      status: 'confirmed',
      payment_method: 'Net Banking',
      transaction_id: 'TXN_001236'
    },
    {
      id: 'book4',
      created_at: '2025-01-27T14:20:00Z',
      amount: 3000,
      payload: { 
        genre: 'Badminton', 
        event_title: 'Badminton Premier League',
        customer_name: 'Neha Singh',
        customer_email: 'neha.singh@email.com',
        seats: ['D5', 'D6'],
        event_date: '2025-03-25'
      },
      status: 'pending',
      payment_method: 'Wallet',
      transaction_id: 'TXN_001237'
    },
    {
      id: 'book5',
      created_at: '2025-01-26T11:30:00Z',
      amount: 5000,
      payload: { 
        genre: 'Cricket', 
        event_title: 'India vs England T20 Series',
        customer_name: 'Vikram Malhotra',
        customer_email: 'vikram.malhotra@email.com',
        seats: ['A8', 'A9'],
        event_date: '2025-02-15'
      },
      status: 'confirmed',
      payment_method: 'Credit Card',
      transaction_id: 'TXN_001238'
    },
    {
      id: 'book6',
      created_at: '2025-01-25T16:45:00Z',
      amount: 1800,
      payload: { 
        genre: 'Kabaddi', 
        event_title: 'Pro Kabaddi League Final',
        customer_name: 'Suresh Verma',
        customer_email: 'suresh.verma@email.com',
        seats: ['E12'],
        event_date: '2025-02-20'
      },
      status: 'cancelled',
      payment_method: 'UPI',
      transaction_id: 'TXN_001239'
    }
  ]

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data, error } = await organiserApi.listBookings()
        if (error) throw error
        if (data && data.length > 0) {
          setBookings(data)
        } else {
          // Use mock data if no API data
          setBookings(mockBookings)
        }
      } catch (err) {
        console.error(err)
        // Fallback to mock data on error
        setBookings(mockBookings)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = useMemo(() => {
    const fromDate = from ? new Date(from) : null
    const toDate = to ? new Date(to) : null
    const q = query.trim().toLowerCase()
    
    return bookings.filter(b => {
      const d = new Date(b.created_at)
      if (fromDate && d < fromDate) return false
      if (toDate && d > toDate) return false
      
      const matchesQuery = !q || 
        b.payload?.customer_name?.toLowerCase().includes(q) ||
        b.payload?.event_title?.toLowerCase().includes(q) ||
        b.payload?.customer_email?.toLowerCase().includes(q)
      
      const matchesGenre = !genre || b.payload?.genre === genre
      const matchesStatus = !status || b.status === status
      
      return matchesQuery && matchesGenre && matchesStatus
    })
  }, [bookings, from, to, query, genre, status])

  const stats = useMemo(() => {
    const total = filtered.length
    const totalAmount = filtered.reduce((sum, b) => sum + (b.amount || 0), 0)
    const avgAmount = total > 0 ? Math.round(totalAmount / total) : 0
    
    const byStatus = filtered.reduce((acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1
      return acc
    }, {})
    
    const byGenre = filtered.reduce((acc, b) => {
      const g = b.payload?.genre || 'Unknown'
      acc[g] = (acc[g] || 0) + 1
      return acc
    }, {})
    
    return { total, totalAmount, avgAmount, byStatus, byGenre }
  }, [filtered])

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-400'
      case 'pending': return 'text-yellow-400'
      case 'cancelled': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-600/30 text-green-300 border border-green-500/30'
      case 'pending': return 'bg-yellow-600/30 text-yellow-300 border border-yellow-500/30'
      case 'cancelled': return 'bg-red-600/30 text-red-300 border border-red-500/30'
      default: return 'bg-gray-600/30 text-gray-300 border border-gray-500/30'
    }
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

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const clearFilters = () => {
    setFrom('')
    setTo('')
    setStatus('')
    setGenre('')
    setQuery('')
  }

  return (
    <div className='min-h-screen'>
      <OrganiserNav />
      <div className='max-w-7xl mx-auto px-6 py-8 text-white'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
          <h1 className='text-2xl font-bold'>🎫 Manage Bookings</h1>
          <div className='flex gap-3'>
            <button
              onClick={clearFilters}
              className='px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm font-medium transition-colors'
            >
              🗑️ Clear Filters
            </button>
            <button
              onClick={() => window.location.reload()}
              className='px-3 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dull)] rounded text-sm font-medium transition-colors'
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className='bg-[#111] rounded-lg p-4 border border-white/10 mb-6'>
          <h3 className='text-sm font-medium text-gray-300 mb-3'>🔍 Filters</h3>
          <div className='grid md:grid-cols-6 gap-3'>
            <input 
              placeholder='Search customer or event' 
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
              <option value='confirmed'>✅ Confirmed</option>
              <option value='pending'>⏳ Pending</option>
              <option value='cancelled'>❌ Cancelled</option>
            </select>
            <div className='flex items-center gap-2'>
              <label className='text-xs text-gray-400'>From</label>
              <input 
                type='date' 
                value={from} 
                onChange={e => setFrom(e.target.value)} 
                className='bg-black/40 rounded p-2 border border-white/20 focus:border-blue-500 focus:outline-none transition-colors' 
              />
            </div>
            <div className='flex items-center gap-2'>
              <label className='text-xs text-gray-400'>To</label>
              <input 
                type='date' 
                value={to} 
                onChange={e => setTo(e.target.value)} 
                className='bg-black/40 rounded p-2 border border-white/20 focus:border-blue-500 focus:outline-none transition-colors' 
              />
            </div>
          </div>
        </div>

        {error && (
          <div className='bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6'>
            <p className='text-red-400'>{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className='grid md:grid-cols-5 gap-4 mb-6'>
          <div className='bg-[#111] rounded-lg p-4 border border-white/10'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-400'>Total Bookings</p>
                <p className='text-2xl font-bold text-blue-400'>{stats.total}</p>
              </div>
              <span className='text-2xl'>🎫</span>
            </div>
          </div>
          <div className='bg-[#111] rounded-lg p-4 border border-white/10'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-400'>Total Amount</p>
                <p className='text-2xl font-bold text-green-400'>₹{(stats.totalAmount / 1000).toFixed(1)}K</p>
              </div>
              <span className='text-2xl'>💰</span>
            </div>
          </div>
          <div className='bg-[#111] rounded-lg p-4 border border-white/10'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-400'>Avg. Amount</p>
                <p className='text-2xl font-bold text-yellow-400'>₹{stats.avgAmount.toLocaleString()}</p>
              </div>
              <span className='text-2xl'>📊</span>
            </div>
          </div>
          <div className='bg-[#111] rounded-lg p-4 border border-white/10'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-400'>Confirmed</p>
                <p className='text-2xl font-bold text-green-400'>{stats.byStatus.confirmed || 0}</p>
              </div>
              <span className='text-2xl'>✅</span>
            </div>
          </div>
          <div className='bg-[#111] rounded-lg p-4 border border-white/10'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-400'>Pending</p>
                <p className='text-2xl font-bold text-yellow-400'>{stats.byStatus.pending || 0}</p>
              </div>
              <span className='text-2xl'>⏳</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className='flex items-center justify-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
          </div>
        ) : (
          <div className='overflow-x-auto bg-[#111] rounded-lg p-6 border border-white/10'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-white/10'>
                  <th className='text-left py-3 px-2'>Customer</th>
                  <th className='text-left py-3 px-2'>Event Details</th>
                  <th className='text-left py-3 px-2'>Booking Date</th>
                  <th className='text-left py-3 px-2'>Amount</th>
                  <th className='text-left py-3 px-2'>Status</th>
                  <th className='text-left py-3 px-2'>Payment</th>
                  <th className='text-right py-3 px-2'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(b => (
                  <tr key={b.id} className='border-b border-white/5 hover:bg-black/20 transition-colors'>
                    <td className='py-3 px-2'>
                      <div>
                        <p className='font-medium text-sm'>{b.payload?.customer_name || 'Anonymous'}</p>
                        <p className='text-xs text-gray-400'>{b.payload?.customer_email || 'No email'}</p>
                      </div>
                    </td>
                    <td className='py-3 px-2'>
                      <div className='flex items-center gap-2 mb-1'>
                        <span className='text-lg'>{getGenreIcon(b.payload?.genre)}</span>
                        <span className='text-sm font-medium'>{b.payload?.event_title || 'Unknown Event'}</span>
                      </div>
                      <div className='text-xs text-gray-400'>
                        {b.payload?.event_date && `Event: ${new Date(b.payload.event_date).toLocaleDateString()}`}
                      </div>
                      <div className='text-xs text-blue-400'>
                        Seats: {b.payload?.seats?.join(', ') || 'N/A'}
                      </div>
                    </td>
                    <td className='py-3 px-2'>
                      <div className='text-sm'>{formatDate(b.created_at)}</div>
                      <div className='text-xs text-gray-400'>ID: {b.id}</div>
                    </td>
                    <td className='py-3 px-2'>
                      <div className='text-lg font-bold text-green-400'>₹{b.amount?.toLocaleString()}</div>
                    </td>
                    <td className='py-3 px-2'>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusBadge(b.status)}`}>
                        {b.status === 'confirmed' ? '✅ Confirmed' : 
                         b.status === 'pending' ? '⏳ Pending' : 
                         b.status === 'cancelled' ? '❌ Cancelled' : b.status}
                      </span>
                    </td>
                    <td className='py-3 px-2'>
                      <div className='text-xs'>
                        <div className='text-gray-300'>{b.payment_method || 'Unknown'}</div>
                        <div className='text-gray-400'>{b.transaction_id || 'No ID'}</div>
                      </div>
                    </td>
                    <td className='py-3 px-2 text-right'>
                      <div className='flex gap-2 justify-end'>
                        <button 
                          className='px-3 py-1 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 rounded text-xs transition-colors'
                          title='View Details'
                        >
                          👁️ View
                        </button>
                        {b.status === 'pending' && (
                          <button 
                            className='px-3 py-1 bg-green-600/30 hover:bg-green-600/50 text-green-300 rounded text-xs transition-colors'
                            title='Confirm Booking'
                          >
                            ✅ Confirm
                          </button>
                        )}
                        {b.status === 'confirmed' && (
                          <button 
                            className='px-3 py-1 bg-yellow-600/30 hover:bg-yellow-600/50 text-yellow-300 rounded text-xs transition-colors'
                            title='Cancel Booking'
                          >
                            ❌ Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className='text-center text-gray-500 py-12'>
                <div className='w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center'>
                  <span className='text-2xl'>🎫</span>
                </div>
                <p className='text-lg mb-2'>No bookings found</p>
                <p className='text-sm text-gray-400'>Try adjusting your filters or check back later</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Bookings
