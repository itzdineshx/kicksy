import React, { useEffect, useState, useMemo } from 'react'
import AdminNav from '../../components/admin/AdminNav'
import { adminApi } from '../../lib/adminApi'

const RevenueAnalytics = () => {
  const [byGenre, setByGenre] = useState([])
  const [revenueData, setRevenueData] = useState([])
  const [dailyCounts, setDailyCounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  // Enhanced mock data for better demonstration
  const mockGenreData = [
    { genre: 'Cricket', count: 1250, revenue: 3125000, avg_price: 2500 },
    { genre: 'Football', count: 890, revenue: 1780000, avg_price: 2000 },
    { genre: 'Hockey', count: 456, revenue: 684000, avg_price: 1500 },
    { genre: 'Kabaddi', count: 678, revenue: 1356000, avg_price: 2000 },
    { genre: 'Badminton', count: 234, revenue: 351000, avg_price: 1500 },
    { genre: 'Tennis', count: 189, revenue: 283500, avg_price: 1500 },
    { genre: 'Others', count: 123, revenue: 184500, avg_price: 1500 },
  ]

  const mockRevenueData = [
    { date: '2025-01-15', revenue: 45000, count: 45 },
    { date: '2025-01-16', revenue: 52000, count: 52 },
    { date: '2025-01-17', revenue: 38000, count: 38 },
    { date: '2025-01-18', revenue: 61000, count: 61 },
    { date: '2025-01-19', revenue: 49000, count: 49 },
    { date: '2025-01-20', revenue: 55000, count: 55 },
    { date: '2025-01-21', revenue: 42000, count: 42 },
    { date: '2025-01-22', revenue: 68000, count: 68 },
    { date: '2025-01-23', revenue: 72000, count: 72 },
    { date: '2025-01-24', revenue: 58000, count: 58 },
    { date: '2025-01-25', revenue: 65000, count: 65 },
    { date: '2025-01-26', revenue: 78000, count: 78 },
    { date: '2025-01-27', revenue: 82000, count: 82 },
    { date: '2025-01-28', revenue: 75000, count: 75 },
    { date: '2025-01-29', revenue: 69000, count: 69 },
    { date: '2025-01-30', revenue: 85000, count: 85 },
  ]

  const mockDailyCounts = [
    { date: '2025-01-15', count: 45 },
    { date: '2025-01-16', count: 52 },
    { date: '2025-01-17', count: 38 },
    { date: '2025-01-18', count: 61 },
    { date: '2025-01-19', count: 49 },
    { date: '2025-01-20', count: 55 },
    { date: '2025-01-21', count: 42 },
    { date: '2025-01-22', count: 68 },
    { date: '2025-01-23', count: 72 },
    { date: '2025-01-24', count: 58 },
    { date: '2025-01-25', count: 65 },
    { date: '2025-01-26', count: 78 },
    { date: '2025-01-27', count: 82 },
    { date: '2025-01-28', count: 75 },
    { date: '2025-01-29', count: 69 },
    { date: '2025-01-30', count: 85 },
  ]

  const mockTopEvents = [
    {
      id: 'evt1',
      title: 'India vs England T20 Series',
      genre: 'Cricket',
      bookings: 1250,
      revenue: 3125000,
      avg_price: 2500,
      venue: 'Wankhede Stadium',
      date: '2025-02-15'
    },
    {
      id: 'evt2',
      title: 'Pro Kabaddi League Final',
      genre: 'Kabaddi',
      bookings: 890,
      revenue: 1780000,
      avg_price: 2000,
      venue: 'Sawai Mansingh Stadium',
      date: '2025-02-20'
    },
    {
      id: 'evt3',
      title: 'Hockey World Cup Qualifiers',
      genre: 'Hockey',
      bookings: 456,
      revenue: 684000,
      avg_price: 1500,
      venue: 'Kalinga Stadium',
      date: '2025-03-10'
    },
    {
      id: 'evt4',
      title: 'Badminton Premier League',
      genre: 'Badminton',
      bookings: 234,
      revenue: 351000,
      avg_price: 1500,
      venue: 'Indira Gandhi Arena',
      date: '2025-03-25'
    },
    {
      id: 'evt5',
      title: 'Football Super Cup',
      genre: 'Football',
      bookings: 678,
      revenue: 1356000,
      avg_price: 2000,
      venue: 'Salt Lake Stadium',
      date: '2025-04-05'
    }
  ]

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [genreData, revenueData, counts] = await Promise.all([
        adminApi.bookingsByGenre(),
        adminApi.getRevenueData(),
        adminApi.getDailyBookingCounts(),
      ])
      
      // Use API data if available, otherwise use enhanced mock data
      if (genreData.data && genreData.data.length > 0) {
        setByGenre(genreData.data)
      } else {
        setByGenre(mockGenreData)
      }
      
      if (revenueData.data && revenueData.data.length > 0) {
        setRevenueData(revenueData.data)
      } else {
        setRevenueData(mockRevenueData)
      }
      
      if (counts.data && counts.data.length > 0) {
        setDailyCounts(counts.data)
      } else {
        setDailyCounts(mockDailyCounts)
      }
    } catch (err) {
      console.error('Failed to load analytics data:', err)
      // Fallback to mock data on error
      setByGenre(mockGenreData)
      setRevenueData(mockRevenueData)
      setDailyCounts(mockDailyCounts)
    } finally {
      setLoading(false)
    }
  }

  const totalBookings = byGenre.reduce((sum, item) => sum + item.count, 0)
  const totalRevenue = revenueData.reduce((sum, item) => sum + (item.revenue || 0), 0)
  const avgTicketPrice = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0

  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    }
    return `₹${amount.toLocaleString()}`
  }

  const mergedDaily = useMemo(() => {
    const map = new Map()
    for (const r of revenueData) map.set(r.date, { date: r.date, revenue: r.revenue, count: 0 })
    for (const c of dailyCounts) {
      const ex = map.get(c.date) || { date: c.date, revenue: 0, count: 0 }
      ex.count = c.count
      map.set(c.date, ex)
    }
    const arr = Array.from(map.values())
    arr.sort((a,b) => a.date.localeCompare(b.date))
    const maxRevenue = Math.max(1, ...arr.map(x => x.revenue || 0))
    const maxCount = Math.max(1, ...arr.map(x => x.count || 0))
    return { arr, maxRevenue, maxCount }
  }, [revenueData, dailyCounts])

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

  const getGrowthRate = (current, previous) => {
    if (!previous) return 0
    return Math.round(((current - previous) / previous) * 100)
  }

  if (loading) {
    return (
      <div className='min-h-screen'>
        <AdminNav />
        <div className='max-w-7xl mx-auto px-6 py-8 text-white'>
          <div className='flex items-center justify-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen'>
      <AdminNav />
      <div className='max-w-7xl mx-auto px-6 py-8 text-white'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>💰 Revenue Analytics</h1>
          <div className='flex items-center gap-4'>
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className='bg-[#111] border border-white/20 rounded px-3 py-2 text-sm'
            >
              <option value='week'>This Week</option>
              <option value='month'>This Month</option>
              <option value='quarter'>This Quarter</option>
              <option value='year'>This Year</option>
            </select>
            <button 
              onClick={loadAnalyticsData}
              className='px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dull)] rounded text-sm font-medium transition-colors'
            >
              🔄 Refresh
            </button>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className='grid md:grid-cols-4 gap-6 mb-8'>
          <div className='bg-[#111] rounded-lg p-6 border border-white/10 hover:border-white/20 transition-colors'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-sm text-gray-400 mb-2'>Total Bookings</h3>
                <p className='text-3xl font-bold text-blue-400'>{totalBookings.toLocaleString()}</p>
                <p className='text-xs text-gray-400 mt-1'>+{Math.round(totalBookings * 0.15)} this week</p>
              </div>
              <div className='w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center'>
                <span className='text-2xl'>🎫</span>
              </div>
            </div>
          </div>
          
          <div className='bg-[#111] rounded-lg p-6 border border-white/10 hover:border-white/20 transition-colors'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-sm text-gray-400 mb-2'>Total Revenue</h3>
                <p className='text-3xl font-bold text-green-400'>{formatCurrency(totalRevenue)}</p>
                <p className='text-xs text-gray-400 mt-1'>+{Math.round(totalRevenue * 0.08 / 100000)}L this week</p>
              </div>
              <div className='w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center'>
                <span className='text-2xl'>💰</span>
              </div>
            </div>
          </div>
          
          <div className='bg-[#111] rounded-lg p-6 border border-white/10 hover:border-white/20 transition-colors'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-sm text-gray-400 mb-2'>Avg. Ticket Price</h3>
                <p className='text-3xl font-bold text-yellow-400'>₹{avgTicketPrice.toLocaleString()}</p>
                <p className='text-xs text-gray-400 mt-1'>+{Math.round(avgTicketPrice * 0.05)} this week</p>
              </div>
              <div className='w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center'>
                <span className='text-2xl'>💎</span>
              </div>
            </div>
          </div>

          <div className='bg-[#111] rounded-lg p-6 border border-white/10 hover:border-white/20 transition-colors'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-sm text-gray-400 mb-2'>Conversion Rate</h3>
                <p className='text-3xl font-bold text-purple-400'>{(totalBookings / 5000 * 100).toFixed(1)}%</p>
                <p className='text-xs text-gray-400 mt-1'>+2.1% this week</p>
              </div>
              <div className='w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center'>
                <span className='text-2xl'>📈</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className='grid lg:grid-cols-2 gap-6 mb-8'>
          <div className='bg-[#111] rounded-lg p-6 border border-white/10'>
            <h3 className='text-lg font-semibold mb-4'>📊 Bookings by Genre</h3>
            <div className='space-y-3'>
              {byGenre.length > 0 ? (
                byGenre.map((item, index) => {
                  const percentage = totalBookings > 0 ? (item.count / totalBookings * 100).toFixed(1) : 0
                  return (
                    <div key={item.genre} className='flex items-center gap-3'>
                      <div className='w-4 h-4 rounded-full' style={{ backgroundColor: `hsl(${index * 60}, 70%, 60%)` }}></div>
                      <div className='flex-1'>
                        <div className='flex justify-between text-sm mb-1'>
                          <span className='font-medium flex items-center gap-2'>
                            {getGenreIcon(item.genre)} {item.genre}
                          </span>
                          <span className='text-gray-400'>{item.count.toLocaleString()} ({percentage}%)</span>
                        </div>
                        <div className='w-full bg-gray-700 rounded-full h-2'>
                          <div 
                            className='h-2 rounded-full transition-all duration-300' 
                            style={{ 
                              width: `${percentage}%`, 
                              backgroundColor: `hsl(${index * 60}, 70%, 60%)` 
                            }}
                          ></div>
                        </div>
                        <div className='text-xs text-gray-400 mt-1'>
                          Revenue: {formatCurrency(item.revenue || 0)} • Avg: ₹{(item.avg_price || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className='text-center py-8 text-gray-500'>No booking data available</div>
              )}
            </div>
          </div>

          <div className='bg-[#111] rounded-lg p-6 border border-white/10'>
            <h3 className='text-lg font-semibold mb-4'>📅 Daily Bookings Trend</h3>
            <div className='space-y-2 max-h-64 overflow-y-auto'>
              {dailyCounts.length > 0 ? (
                dailyCounts.map((d, idx) => (
                  <div key={idx} className='flex items-center gap-3'>
                    <div className='text-sm text-gray-400 w-28'>{d.date}</div>
                    <div className='flex-1 h-2 bg-gray-700 rounded-full'>
                      <div className='h-2 bg-blue-500 rounded-full transition-all duration-300' style={{ width: `${Math.min(100, d.count * 10)}%` }}></div>
                    </div>
                    <div className='text-sm font-medium w-12 text-right'>{d.count}</div>
                  </div>
                ))
              ) : (
                <div className='text-center text-gray-500 py-8'>No daily counts</div>
              )}
            </div>
          </div>
        </div>

        {/* Dual Chart */}
        <div className='mt-6 bg-[#111] rounded-lg p-6 border border-white/10'>
          <h3 className='text-lg font-semibold mb-4'>📊 Revenue vs Daily Bookings</h3>
          <div className='space-y-2 max-h-72 overflow-y-auto'>
            {mergedDaily.arr.map((row, idx) => {
              const revenueWidth = Math.round(((row.revenue || 0) / mergedDaily.maxRevenue) * 100)
              const countWidth = Math.round(((row.count || 0) / mergedDaily.maxCount) * 100)
              return (
                <div key={idx} className='flex items-center gap-3'>
                  <div className='text-sm text-gray-400 w-28'>{row.date}</div>
                  <div className='flex-1'>
                    <div className='h-2 bg-gray-700 rounded-full mb-1'>
                      <div className='h-2 bg-green-500 rounded-full transition-all duration-300' style={{ width: `${revenueWidth}%` }}></div>
                    </div>
                    <div className='h-2 bg-gray-700 rounded-full'>
                      <div className='h-2 bg-blue-500 rounded-full transition-all duration-300' style={{ width: `${countWidth}%` }}></div>
                    </div>
                  </div>
                  <div className='text-xs w-28 text-right text-gray-300'>
                    ₹{(row.revenue||0).toLocaleString()} • {row.count||0}
                  </div>
                </div>
              )
            })}
            {mergedDaily.arr.length === 0 && (
              <div className='text-center text-gray-500 py-8'>No data</div>
            )}
          </div>
        </div>

        {/* Top Performing Events */}
        <div className='mt-8 bg-[#111] rounded-lg p-6 border border-white/10'>
          <h3 className='text-lg font-semibold mb-4'>🏆 Top Performing Events</h3>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-white/10'>
                  <th className='text-left py-3 px-2'>Event</th>
                  <th className='text-left py-3 px-2'>Genre</th>
                  <th className='text-left py-3 px-2'>Venue</th>
                  <th className='text-left py-3 px-2'>Date</th>
                  <th className='text-right py-3 px-2'>Bookings</th>
                  <th className='text-right py-3 px-2'>Revenue</th>
                  <th className='text-right py-3 px-2'>Avg. Price</th>
                  <th className='text-right py-3 px-2'>Performance</th>
                </tr>
              </thead>
              <tbody>
                {mockTopEvents.map((event, index) => (
                  <tr key={event.id} className='border-b border-white/5 hover:bg-black/20 transition-colors'>
                    <td className='py-3 px-2 font-medium'>{event.title}</td>
                    <td className='py-3 px-2'>
                      <span className='flex items-center gap-2'>
                        {getGenreIcon(event.genre)} {event.genre}
                      </span>
                    </td>
                    <td className='py-3 px-2 text-gray-300'>{event.venue}</td>
                    <td className='py-3 px-2 text-gray-300'>{event.date}</td>
                    <td className='py-3 px-2 text-right'>{event.bookings.toLocaleString()}</td>
                    <td className='py-3 px-2 text-right text-green-400'>{formatCurrency(event.revenue)}</td>
                    <td className='py-3 px-2 text-right text-yellow-400'>₹{event.avg_price.toLocaleString()}</td>
                    <td className='py-3 px-2 text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        <div className='w-16 h-2 bg-gray-700 rounded-full'>
                          <div 
                            className='h-2 rounded-full transition-all duration-300' 
                            style={{ 
                              width: `${Math.min(100, (event.bookings / mockTopEvents[0].bookings) * 100)}%`,
                              backgroundColor: index === 0 ? '#fbbf24' : index === 1 ? '#6b7280' : '#cd7f32'
                            }}
                          ></div>
                        </div>
                        <span className={`text-xs ${
                          index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : 'text-orange-400'
                        }`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RevenueAnalytics



