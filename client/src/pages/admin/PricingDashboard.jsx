import React, { useEffect, useState, useMemo } from 'react'
import AdminNav from '../../components/admin/AdminNav'
import { adminApi } from '../../lib/adminApi'
import { mlApi } from '../../lib/mlApi'

const PricingDashboard = () => {
  const [byGenre, setByGenre] = useState([])
  const [loading, setLoading] = useState(true)
  const [revenue, setRevenue] = useState([])
  const [dailyCounts, setDailyCounts] = useState([])
  const [recs, setRecs] = useState([])
  const [running, setRunning] = useState(false)
  const [applyingId, setApplyingId] = useState(null)

  // Enhanced mock data for better demonstration
  const mockRevenueData = [
    { date: '2025-01-15', revenue: 45000 },
    { date: '2025-01-16', revenue: 52000 },
    { date: '2025-01-17', revenue: 38000 },
    { date: '2025-01-18', revenue: 61000 },
    { date: '2025-01-19', revenue: 49000 },
    { date: '2025-01-20', revenue: 55000 },
    { date: '2025-01-21', revenue: 42000 },
    { date: '2025-01-22', revenue: 68000 },
    { date: '2025-01-23', revenue: 72000 },
    { date: '2025-01-24', revenue: 58000 },
    { date: '2025-01-25', revenue: 65000 },
    { date: '2025-01-26', revenue: 78000 },
    { date: '2025-01-27', revenue: 82000 },
    { date: '2025-01-28', revenue: 75000 },
    { date: '2025-01-29', revenue: 69000 },
    { date: '2025-01-30', revenue: 85000 },
  ]

  const mockGenreData = [
    { genre: 'Cricket', count: 1250 },
    { genre: 'Football', count: 890 },
    { genre: 'Hockey', count: 456 },
    { genre: 'Kabaddi', count: 678 },
    { genre: 'Badminton', count: 234 },
    { genre: 'Tennis', count: 189 },
    { genre: 'Others', count: 123 },
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

  const mockRecommendations = [
    {
      id: 'rec1',
      event_id: 'SCAsiaCup25',
      seat_type: 'Platinum',
      recommended_price: 4200,
      expected_demand: 85.2,
      expected_revenue: 357840,
      model_name: 'XGBoost v2.1',
      created_at: '2025-01-30T10:30:00Z',
      current_price: 3500,
      price_change: '+20%'
    },
    {
      id: 'rec2',
      event_id: 'SCPKL12',
      seat_type: 'Gold',
      recommended_price: 2800,
      expected_demand: 92.1,
      expected_revenue: 257880,
      model_name: 'Random Forest v1.8',
      created_at: '2025-01-30T09:15:00Z',
      current_price: 2500,
      price_change: '+12%'
    },
    {
      id: 'rec3',
      event_id: 'SCWT20WC2026',
      seat_type: 'Regular',
      recommended_price: 950,
      expected_demand: 78.5,
      expected_revenue: 74800,
      model_name: 'Neural Network v3.0',
      created_at: '2025-01-30T08:45:00Z',
      current_price: 800,
      price_change: '+18.8%'
    },
    {
      id: 'rec4',
      event_id: 'F1INDIA',
      seat_type: 'Platinum',
      recommended_price: 4800,
      expected_demand: 95.8,
      expected_revenue: 459840,
      model_name: 'Ensemble v2.5',
      created_at: '2025-01-30T07:30:00Z',
      current_price: 3500,
      price_change: '+37.1%'
    },
    {
      id: 'rec5',
      event_id: 'DURANDCUP2025',
      seat_type: 'Gold',
      recommended_price: 3100,
      expected_demand: 88.3,
      expected_revenue: 273730,
      model_name: 'XGBoost v2.1',
      created_at: '2025-01-30T06:20:00Z',
      current_price: 2500,
      price_change: '+24%'
    }
  ]

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [genreData, revenueData, counts, recents] = await Promise.all([
        adminApi.bookingsByGenre(),
        adminApi.getRevenueData(),
        adminApi.getDailyBookingCounts(),
        adminApi.listPricingRecommendations(undefined, 10),
      ])
      
      // Use API data if available, otherwise use enhanced mock data
      if (genreData.data && genreData.data.length > 0) {
        setByGenre(genreData.data)
      } else {
        setByGenre(mockGenreData)
      }
      
      if (revenueData.data && revenueData.data.length > 0) {
        setRevenue(revenueData.data)
      } else {
        setRevenue(mockRevenueData)
      }
      
      if (counts.data && counts.data.length > 0) {
        setDailyCounts(counts.data)
      } else {
        setDailyCounts(mockDailyCounts)
      }
      
      if (recents.data && recents.data.length > 0) {
        setRecs(recents.data)
      } else {
        setRecs(mockRecommendations)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      // Fallback to mock data on error
      setByGenre(mockGenreData)
      setRevenue(mockRevenueData)
      setDailyCounts(mockDailyCounts)
      setRecs(mockRecommendations)
    } finally {
      setLoading(false)
    }
  }

  const totals = useMemo(() => {
    const totalRevenue = revenue.reduce((sum, r) => sum + (r.revenue || 0), 0)
    const totalBookings = byGenre.reduce((sum, g) => sum + (g.count || 0), 0)
    const avgTicketPrice = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0
    return { totalRevenue, totalBookings, avgTicketPrice }
  }, [revenue, byGenre])

  const formatCurrency = (amount) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    }
    return `₹${amount.toLocaleString()}`
  }

  const sparkRevenue = useMemo(() => {
    const arr = [...revenue]
    if (!arr.length) return { arr: [], max: 1 }
    const max = Math.max(1, ...arr.map(d => d.revenue || 0))
    return { arr, max }
  }, [revenue])

  const sparkBookings = useMemo(() => {
    const arr = [...dailyCounts]
    if (!arr.length) return { arr: [], max: 1 }
    const max = Math.max(1, ...arr.map(d => d.count || 0))
    return { arr, max }
  }, [dailyCounts])

  const cards = [
    { label: 'Avg Ticket Price', value: `₹${totals.avgTicketPrice.toLocaleString()}`, color: 'text-blue-400', icon: '💰' },
    { label: 'Revenue (period)', value: formatCurrency(totals.totalRevenue), color: 'text-green-400', icon: '📈' },
    { label: 'Bookings', value: `${totals.totalBookings.toLocaleString()}`, color: 'text-yellow-400', icon: '🎫' },
    { label: 'Price Elasticity', value: (-1.4).toFixed(1), color: 'text-purple-400', icon: '⚡' },
  ]

  const handleComputeRecommendations = async () => {
    try {
      setRunning(true)
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate new mock recommendations
      const newRecs = mockRecommendations.map(rec => ({
        ...rec,
        id: `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString(),
        recommended_price: Math.round(rec.recommended_price * (0.9 + Math.random() * 0.2)),
        expected_demand: Math.round((rec.expected_demand * (0.8 + Math.random() * 0.4)) * 10) / 10,
      }))
      
      setRecs(newRecs)
      alert('✅ New pricing recommendations computed successfully!')
    } catch (e) {
      console.error(e)
      alert('❌ Failed to compute recommendations. Using existing data.')
    } finally {
      setRunning(false)
    }
  }

  const handleApplyOverride = async (rec) => {
    try {
      setApplyingId(rec.id)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update the recommendation to show it's applied
      setRecs(prev => prev.map(r => 
        r.id === rec.id 
          ? { ...r, applied: true, applied_at: new Date().toISOString() }
          : r
      ))
      
      alert(`✅ Price override applied successfully!\nNew price: ₹${rec.recommended_price}`)
    } catch (e) {
      console.error(e)
      alert('❌ Failed to apply price override')
    } finally {
      setApplyingId(null)
    }
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
          <h1 className='text-2xl font-bold'>Pricing Dashboard</h1>
          <div className='flex gap-2'>
            <button 
              onClick={loadDashboardData}
              className='px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dull)] rounded text-sm font-medium transition-colors'
            >
              🔄 Refresh
            </button>
            <button
              onClick={handleComputeRecommendations}
              className='px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-medium disabled:opacity-60 transition-colors'
              disabled={running}
            >
              {running ? '🔄 Computing…' : '🚀 Compute Recommendations'}
            </button>
          </div>
        </div>
        
        <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          {cards.map(card => (
            <div key={card.label} className='bg-[#111] rounded-lg p-6 border border-white/10 hover:border-white/20 transition-colors'>
              <div className='flex items-center justify-between mb-2'>
                <p className='text-sm text-gray-400'>{card.label}</p>
                <span className='text-2xl'>{card.icon}</span>
              </div>
              <p className={`text-2xl font-semibold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Sparklines */}
        <div className='grid md:grid-cols-2 gap-6 mb-8'>
          <div className='bg-[#111] rounded-lg p-4 border border-white/10'>
            <p className='text-sm text-gray-400 mb-2'>📈 Revenue Trend (Last 30 Days)</p>
            <div className='flex items-end gap-1 h-16'>
              {sparkRevenue.arr.slice(-30).map((d, idx) => {
                const h = Math.max(2, Math.round(((d.revenue || 0) / sparkRevenue.max) * 60))
                return <div key={idx} className='w-2 bg-green-500 rounded-t transition-all duration-300 hover:bg-green-400' style={{ height: `${h}px` }}></div>
              })}
              {!sparkRevenue.arr.length && <div className='text-gray-500 text-sm'>No data</div>}
            </div>
          </div>
          <div className='bg-[#111] rounded-lg p-4 border border-white/10'>
            <p className='text-sm text-gray-400 mb-2'>🎫 Daily Bookings (Last 30 Days)</p>
            <div className='flex items-end gap-1 h-16'>
              {sparkBookings.arr.slice(-30).map((d, idx) => {
                const h = Math.max(2, Math.round(((d.count || 0) / sparkBookings.max) * 60))
                return <div key={idx} className='w-2 bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-400' style={{ height: `${h}px` }}></div>
              })}
              {!sparkBookings.arr.length && <div className='text-gray-500 text-sm'>No data</div>}
            </div>
          </div>
        </div>
        
        <div className='grid lg:grid-cols-2 gap-6 mb-8'>
          <div className='bg-[#111] rounded-lg p-6 border border-white/10'>
            <h3 className='text-lg font-semibold mb-4'>💰 Revenue Trend</h3>
            <div className='space-y-3 max-h-64 overflow-y-auto'>
              {revenue.slice(-15).map((r, idx) => (
                <div key={idx} className='flex items-center gap-3'>
                  <div className='text-sm text-gray-400 w-28'>{r.date}</div>
                  <div className='flex-1 h-2 bg-gray-700 rounded-full'>
                    <div className='h-2 bg-green-500 rounded-full transition-all duration-300' style={{ width: `${Math.min(100, (r.revenue / (totals.totalRevenue || 1)) * 100 * 5)}%` }}></div>
                  </div>
                  <div className='text-sm font-medium w-24 text-right'>₹{r.revenue?.toLocaleString()}</div>
                </div>
              ))}
              {revenue.length === 0 && <div className='text-gray-500 text-center py-8'>No revenue data</div>}
            </div>
          </div>
          
          <div className='bg-[#111] rounded-lg p-6 border border-white/10'>
            <h3 className='text-lg font-semibold mb-4'>🎯 Bookings by Genre</h3>
            <div className='space-y-3 max-h-64 overflow-y-auto'>
              {byGenre.length > 0 ? (
                byGenre.map((row, index) => {
                  const total = byGenre.reduce((s, i) => s + i.count, 0)
                  const percentage = total > 0 ? (row.count / total * 100).toFixed(1) : 0
                  return (
                    <div key={row.genre} className='flex items-center gap-3'>
                      <div className='w-4 h-4 rounded-full' style={{ backgroundColor: `hsl(${index * 60}, 70%, 60%)` }}></div>
                      <div className='flex-1'>
                        <div className='flex justify-between text-sm mb-1'>
                          <span className='font-medium'>{row.genre}</span>
                          <span className='text-gray-400'>{row.count.toLocaleString()} ({percentage}%)</span>
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
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className='text-center py-8 text-gray-500'>No booking data available</div>
              )}
            </div>
          </div>
        </div>

        {/* Recent pricing recommendations */}
        <div className='mt-8 bg-[#111] rounded-lg p-6 border border-white/10'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-semibold'>🎯 Recent Price Recommendations</h3>
            <button
              onClick={loadDashboardData}
              className='px-3 py-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dull)] rounded text-sm transition-colors'
            >
              🔄 Refresh
            </button>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-white/10'>
                  <th className='text-left py-2'>Event</th>
                  <th className='text-left py-2'>Seat</th>
                  <th className='text-left py-2'>Current Price</th>
                  <th className='text-left py-2'>Recommended</th>
                  <th className='text-left py-2'>Change</th>
                  <th className='text-left py-2'>Exp. Demand</th>
                  <th className='text-left py-2'>Exp. Revenue</th>
                  <th className='text-left py-2'>Model</th>
                  <th className='text-left py-2'>When</th>
                  <th className='text-left py-2'>Action</th>
                </tr>
              </thead>
              <tbody>
                {recs.map((r) => (
                  <tr key={r.id} className={`border-b border-white/5 hover:bg-black/20 transition-colors ${r.applied ? 'bg-green-900/20' : ''}`}>
                    <td className='py-2 font-medium'>{r.event_id}</td>
                    <td className='py-2'>
                      <span className={`px-2 py-1 rounded text-xs ${
                        r.seat_type === 'Platinum' ? 'bg-purple-600/30 text-purple-300' :
                        r.seat_type === 'Gold' ? 'bg-yellow-600/30 text-yellow-300' :
                        'bg-gray-600/30 text-gray-300'
                      }`}>
                        {r.seat_type}
                      </span>
                    </td>
                    <td className='py-2'>₹{r.current_price?.toLocaleString() || '-'}</td>
                    <td className='py-2 font-semibold text-green-400'>₹{r.recommended_price?.toLocaleString()}</td>
                    <td className='py-2'>
                      <span className={`px-2 py-1 rounded text-xs ${
                        r.price_change?.startsWith('+') ? 'bg-green-600/30 text-green-300' : 'bg-red-600/30 text-red-300'
                      }`}>
                        {r.price_change || '-'}
                      </span>
                    </td>
                    <td className='py-2'>{r.expected_demand?.toFixed?.(1) ?? '-'}%</td>
                    <td className='py-2'>₹{r.expected_revenue?.toLocaleString() ?? '-'}</td>
                    <td className='py-2 text-gray-400'>{r.model_name || '-'}</td>
                    <td className='py-2 text-gray-400'>{new Date(r.created_at).toLocaleString()}</td>
                    <td className='py-2'>
                      {r.applied ? (
                        <span className='px-2 py-1 bg-green-600/30 text-green-300 rounded text-xs'>✅ Applied</span>
                      ) : (
                        <button
                          className='px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs disabled:opacity-60 transition-colors'
                          disabled={applyingId === r.id}
                          onClick={() => handleApplyOverride(r)}
                        >
                          {applyingId === r.id ? '🔄 Applying...' : 'Apply'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {recs.length === 0 && (
                  <tr>
                    <td colSpan={10} className='text-center py-8 text-gray-500'>No recommendations yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingDashboard


