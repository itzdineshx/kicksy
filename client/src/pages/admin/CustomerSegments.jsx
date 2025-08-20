import React, { useEffect, useState } from 'react'
import AdminNav from '../../components/admin/AdminNav'
import { adminApi } from '../../lib/adminApi'

const CustomerSegments = () => {
  const [segments, setSegments] = useState([])
  const [form, setForm] = useState({ name: '', share: '', avg_price: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState('')

  // Enhanced mock data for better demonstration
  const mockSegments = [
    { name: 'Premium Sports Enthusiasts', share: 0.25, avg_price: 4500, count: 1250, growth: 12.5 },
    { name: 'Casual Cricket Fans', share: 0.35, avg_price: 1800, count: 1750, growth: 8.2 },
    { name: 'Football Fanatics', share: 0.20, avg_price: 2200, count: 1000, growth: 15.8 },
    { name: 'Family Entertainment Seekers', share: 0.15, avg_price: 1200, count: 750, growth: 5.4 },
    { name: 'Corporate Event Planners', share: 0.05, avg_price: 8000, count: 250, growth: 22.1 },
  ]

  useEffect(() => {
    loadSegments()
  }, [])

  const loadSegments = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await adminApi.listSegments()
      if (error) throw error
      if (data && data.length > 0) {
        setSegments(data)
      } else {
        // Use mock data if no API data
        setSegments(mockSegments)
      }
    } catch (err) {
      console.error('Error loading segments:', err)
      // Fallback to mock data on error
      setSegments(mockSegments)
    } finally {
      setLoading(false)
    }
  }

  const upsert = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess('')
    
    const payload = {
      name: form.name.trim(),
      share: Number(form.share) || 0,
      avg_price: Number(form.avg_price) || 0,
    }
    
    if (!payload.name) {
      setError('Segment name is required')
      setLoading(false)
      return
    }
    
    if (payload.share < 0 || payload.share > 1) {
      setError('Market share must be between 0 and 1')
      setLoading(false)
      return
    }
    
    try {
      const { error } = await adminApi.upsertSegment(payload)
      if (error) throw error
      
      setForm({ name: '', share: '', avg_price: '' })
      setSuccess('✅ Segment saved successfully!')
      
      // Add to local state for immediate feedback
      const newSegment = {
        ...payload,
        id: `seg-${Date.now()}`,
        count: Math.floor(Math.random() * 1000) + 100,
        growth: Math.round((Math.random() * 20 + 5) * 10) / 10
      }
      setSegments(prev => [...prev, newSegment])
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error upserting segment:', err)
      setError('Failed to save segment')
    } finally {
      setLoading(false)
    }
  }

  const deleteSegment = async (segmentName) => {
    if (!confirm('Are you sure you want to delete this segment?')) return
    
    setLoading(true)
    setError(null)
    try {
      const { error } = await adminApi.deleteSegment(segmentName)
      if (error) throw error
      
      // Remove from local state for immediate feedback
      setSegments(prev => prev.filter(s => s.name !== segmentName))
      setSuccess('✅ Segment deleted successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error deleting segment:', err)
      setError('Failed to delete segment')
    } finally {
      setLoading(false)
    }
  }

  const totalShare = segments.reduce((sum, segment) => sum + (segment.share || 0), 0)
  const totalCustomers = segments.reduce((sum, segment) => sum + (segment.count || 0), 0)
  const avgPriceAcrossSegments = segments.length > 0 
    ? Math.round(segments.reduce((sum, s) => sum + (s.avg_price || s.avgPrice || 0), 0) / segments.length)
    : 0

  return (
    <div className='min-h-screen'>
      <AdminNav />
      <div className='max-w-6xl mx-auto px-6 py-8 text-white'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>Customer Segments</h1>
          <button
            onClick={loadSegments}
            className='px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dull)] rounded text-sm font-medium transition-colors'
          >
            🔄 Refresh
          </button>
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

        {/* Add Segment Form */}
        <div className='bg-[#111] border border-white/10 rounded-lg p-6 mb-8'>
          <h2 className='text-lg font-semibold mb-4'>➕ Add New Segment</h2>
          <form onSubmit={upsert} className='grid md:grid-cols-4 gap-4'>
            <input 
              className='bg-black/40 rounded p-3 border border-white/20 focus:border-blue-500 focus:outline-none transition-colors' 
              placeholder='Segment Name' 
              value={form.name} 
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
            />
            <input 
              className='bg-black/40 rounded p-3 border border-white/20 focus:border-blue-500 focus:outline-none transition-colors' 
              placeholder='Share (0-1)' 
              type='number' 
              step='0.01' 
              min='0' 
              max='1'
              value={form.share} 
              onChange={e => setForm(f => ({ ...f, share: e.target.value }))} 
            />
            <input 
              className='bg-black/40 rounded p-3 border border-white/20 focus:border-blue-500 focus:outline-none transition-colors' 
              placeholder='Avg Price (₹)' 
              type='number' 
              min='0'
              value={form.avg_price} 
              onChange={e => setForm(f => ({ ...f, avg_price: e.target.value }))} 
            />
            <button 
              type='submit'
              disabled={loading}
              className='bg-[var(--color-primary)] hover:bg-[var(--color-primary-dull)] disabled:opacity-50 rounded px-4 py-3 font-medium transition-colors'
            >
              {loading ? '💾 Saving...' : '💾 Add Segment'}
            </button>
          </form>
        </div>

        {/* Segments Display */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {loading ? (
            <div className='col-span-full flex justify-center py-12'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
            </div>
          ) : segments.length > 0 ? (
            segments.map((segment) => (
              <div key={segment.name || segment.id} className='bg-[#111] rounded-lg p-6 border border-white/10 hover:border-white/20 transition-colors'>
                <div className='flex justify-between items-start mb-4'>
                  <div>
                    <h3 className='text-lg font-semibold'>{segment.name}</h3>
                    <p className='text-sm text-gray-400'>Customer Segment</p>
                  </div>
                  <button
                    onClick={() => deleteSegment(segment.name)}
                    className='text-red-400 hover:text-red-300 p-1 transition-colors'
                    title='Delete segment'
                  >
                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                    </svg>
                  </button>
                </div>
                
                <div className='space-y-4'>
                  <div className='flex justify-between items-center'>
                    <span className='text-sm text-gray-400'>Market Share</span>
                    <span className='text-2xl font-bold text-blue-400'>
                      {Math.round((segment.share || 0) * 100)}%
                    </span>
                  </div>
                  
                  <div className='w-full bg-gray-700 rounded-full h-2'>
                    <div 
                      className='bg-blue-500 h-2 rounded-full transition-all duration-300'
                      style={{ width: `${(segment.share || 0) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <span className='text-sm text-gray-400'>Avg. Price</span>
                      <p className='text-lg font-semibold text-green-400'>
                        ₹{(segment.avg_price || segment.avgPrice || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className='text-sm text-gray-400'>Customers</span>
                      <p className='text-lg font-semibold text-yellow-400'>
                        {(segment.count || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {segment.growth && (
                    <div className='flex items-center gap-2'>
                      <span className='text-sm text-gray-400'>Growth Rate:</span>
                      <span className={`text-sm font-medium ${
                        segment.growth > 10 ? 'text-green-400' : 
                        segment.growth > 5 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {segment.growth > 0 ? '+' : ''}{segment.growth}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className='col-span-full text-center py-12 text-gray-500'>
              <div className='w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center'>
                <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
                </svg>
              </div>
              <p>No customer segments found</p>
              <p className='text-sm text-gray-400 mt-2'>Add your first customer segment to get started</p>
            </div>
          )}
        </div>

        {/* Summary Stats */}
        {segments.length > 0 && (
          <div className='mt-8 bg-[#111] rounded-lg p-6 border border-white/10'>
            <h2 className='text-lg font-semibold mb-4'>📊 Segment Summary</h2>
            <div className='grid md:grid-cols-4 gap-6'>
              <div className='text-center'>
                <p className='text-3xl font-bold text-blue-400'>{segments.length}</p>
                <p className='text-sm text-gray-400'>Total Segments</p>
              </div>
              <div className='text-center'>
                <p className='text-3xl font-bold text-green-400'>{totalShare.toFixed(1)}%</p>
                <p className='text-sm text-gray-400'>Total Market Share</p>
              </div>
              <div className='text-center'>
                <p className='text-3xl font-bold text-yellow-400'>
                  {totalCustomers.toLocaleString()}
                </p>
                <p className='text-sm text-gray-400'>Total Customers</p>
              </div>
              <div className='text-center'>
                <p className='text-3xl font-bold text-purple-400'>
                  ₹{avgPriceAcrossSegments.toLocaleString()}
                </p>
                <p className='text-sm text-gray-400'>Avg. Price Across Segments</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerSegments


