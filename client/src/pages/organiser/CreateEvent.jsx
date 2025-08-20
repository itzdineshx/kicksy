import React, { useState } from 'react'
import OrganiserNav from '../../components/organiser/OrganiserNav'
import { organiserApi } from '../../lib/organiserApi'

const CreateEvent = () => {
  const [form, setForm] = useState({
    title: '',
    date: '',
    venue: '',
    genre: 'Cricket',
    base_price: 1000,
    capacity: 5000,
    banner_url: '',
    description: '',
    is_published: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState('')
  const [preview, setPreview] = useState(false)

  // Enhanced form validation
  const validateForm = () => {
    if (!form.title.trim()) {
      setError('Event title is required')
      return false
    }
    if (!form.date) {
      setError('Event date is required')
      return false
    }
    if (!form.venue.trim()) {
      setError('Venue is required')
      return false
    }
    if (form.base_price <= 0) {
      setError('Base price must be greater than 0')
      return false
    }
    if (form.capacity <= 0) {
      setError('Capacity must be greater than 0')
      return false
    }
    if (new Date(form.date) < new Date()) {
      setError('Event date cannot be in the past')
      return false
    }
    return true
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    
    setLoading(true)
    setError(null)
    setSuccess('')
    try {
      const payload = { 
        ...form,
        id: `evt-${Date.now()}`,
        created_at: new Date().toISOString(),
        status: form.is_published ? 'active' : 'draft',
        bookings_count: 0,
        revenue: 0
      }
      
      const { error } = await organiserApi.upsertEvent(payload)
      if (error) throw error
      
      setSuccess('✅ Event saved successfully!')
      setForm({ title: '', date: '', venue: '', genre: 'Cricket', base_price: 1000, capacity: 5000, banner_url: '', description: '', is_published: false })
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000)
    } catch (err) {
      console.error(err)
      setError('Failed to save event. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const generateMockData = () => {
    const mockTitles = [
      'India vs Australia T20 Series',
      'Pro Kabaddi League Season 13',
      'Hockey Champions Trophy',
      'Badminton Premier League',
      'Football Super Cup Final'
    ]
    const mockVenues = [
      'Wankhede Stadium, Mumbai',
      'Eden Gardens, Kolkata',
      'Chinnaswamy Stadium, Bangalore',
      'Arun Jaitley Stadium, Delhi',
      'Punjab Cricket Stadium, Mohali'
    ]
    
    const randomTitle = mockTitles[Math.floor(Math.random() * mockTitles.length)]
    const randomVenue = mockVenues[Math.floor(Math.random() * mockVenues.length)]
    const randomDate = new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const randomGenre = ['Cricket', 'Football', 'Hockey', 'Badminton', 'Kabaddi'][Math.floor(Math.random() * 5)]
    
    setForm({
      title: randomTitle,
      date: randomDate,
      venue: randomVenue,
      genre: randomGenre,
      base_price: Math.floor(Math.random() * 3000) + 500,
      capacity: Math.floor(Math.random() * 50000) + 5000,
      banner_url: 'https://via.placeholder.com/800x400/1f2937/ffffff?text=Event+Banner',
      description: `Exciting ${randomGenre.toLowerCase()} event featuring top teams and players. Don't miss this thrilling competition!`,
      is_published: Math.random() > 0.5,
    })
    setSuccess('🎲 Mock data generated! You can now edit and save.')
    setTimeout(() => setSuccess(''), 3000)
  }

  return (
    <div className='min-h-screen'>
      <OrganiserNav />
      <div className='max-w-4xl mx-auto px-6 py-8 text-white'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>🎪 Create Event</h1>
          <div className='flex gap-2'>
            <button
              onClick={generateMockData}
              className='px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm font-medium transition-colors'
            >
              🎲 Generate Mock Data
            </button>
            <button
              onClick={() => setPreview(!preview)}
              className='px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm font-medium transition-colors'
            >
              {preview ? '✏️ Edit Mode' : '👁️ Preview'}
            </button>
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

        {preview ? (
          <div className='bg-[#111] rounded-lg p-6 border border-white/10'>
            <h2 className='text-xl font-semibold mb-4'>👁️ Event Preview</h2>
            <div className='space-y-4'>
              <div className='grid md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm text-gray-400 mb-1'>Event Title</label>
                  <p className='text-lg font-medium'>{form.title || 'No title'}</p>
                </div>
                <div>
                  <label className='block text-sm text-gray-400 mb-1'>Date & Time</label>
                  <p className='text-lg font-medium'>{form.date || 'No date'}</p>
                </div>
              </div>
              <div className='grid md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm text-gray-400 mb-1'>Venue</label>
                  <p className='text-lg font-medium'>{form.venue || 'No venue'}</p>
                </div>
                <div>
                  <label className='block text-sm text-gray-400 mb-1'>Genre</label>
                  <p className='text-lg font-medium'>{form.genre}</p>
                </div>
              </div>
              <div className='grid md:grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm text-gray-400 mb-1'>Base Price</label>
                  <p className='text-lg font-medium text-green-400'>₹{form.base_price?.toLocaleString()}</p>
                </div>
                <div>
                  <label className='block text-sm text-gray-400 mb-1'>Capacity</label>
                  <p className='text-lg font-medium text-blue-400'>{form.capacity?.toLocaleString()}</p>
                </div>
              </div>
              {form.description && (
                <div>
                  <label className='block text-sm text-gray-400 mb-1'>Description</label>
                  <p className='text-gray-300'>{form.description}</p>
                </div>
              )}
              <div className='flex items-center gap-2'>
                <span className='text-sm text-gray-400'>Status:</span>
                <span className={`px-2 py-1 rounded text-xs ${
                  form.is_published ? 'bg-green-600/30 text-green-300' : 'bg-gray-600/30 text-gray-300'
                }`}>
                  {form.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className='bg-[#111] rounded-lg p-6 border border-white/10 space-y-6'>
            <div className='grid md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm text-gray-300 mb-2'>🎯 Event Title *</label>
                <input 
                  className='w-full bg-black/40 rounded p-3 border border-white/20 focus:border-blue-500 focus:outline-none transition-colors' 
                  value={form.title} 
                  onChange={e => handleInputChange('title', e.target.value)} 
                  placeholder='Enter event title'
                  required 
                />
              </div>
              <div>
                <label className='block text-sm text-gray-300 mb-2'>📅 Event Date *</label>
                <input 
                  type='date' 
                  className='w-full bg-black/40 rounded p-3 border border-white/20 focus:border-blue-500 focus:outline-none transition-colors' 
                  value={form.date} 
                  onChange={e => handleInputChange('date', e.target.value)} 
                  min={new Date().toISOString().split('T')[0]}
                  required 
                />
              </div>
            </div>
            
            <div className='grid md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm text-gray-300 mb-2'>🏟️ Venue *</label>
                <input 
                  className='w-full bg-black/40 rounded p-3 border border-white/20 focus:border-blue-500 focus:outline-none transition-colors' 
                  value={form.venue} 
                  onChange={e => handleInputChange('venue', e.target.value)} 
                  placeholder='Enter venue name and city'
                  required 
                />
              </div>
              <div>
                <label className='block text-sm text-gray-300 mb-2'>⚽ Sport Genre</label>
                <select 
                  className='w-full bg-black/40 rounded p-3 border border-white/20 focus:border-blue-500 focus:outline-none transition-colors' 
                  value={form.genre} 
                  onChange={e => handleInputChange('genre', e.target.value)}
                >
                  <option value='Cricket'>🏏 Cricket</option>
                  <option value='Football'>⚽ Football</option>
                  <option value='Hockey'>🏑 Hockey</option>
                  <option value='Badminton'>🏸 Badminton</option>
                  <option value='Kabaddi'>🤼 Kabaddi</option>
                  <option value='Tennis'>🎾 Tennis</option>
                  <option value='Others'>🏅 Others</option>
                </select>
              </div>
            </div>
            
            <div className='grid md:grid-cols-2 gap-6'>
              <div>
                <label className='block text-sm text-gray-300 mb-2'>💰 Base Price (₹) *</label>
                <input 
                  type='number' 
                  min='100' 
                  step='100'
                  className='w-full bg-black/40 rounded p-3 border border-white/20 focus:border-blue-500 focus:outline-none transition-colors' 
                  value={form.base_price} 
                  onChange={e => handleInputChange('base_price', Number(e.target.value))} 
                  placeholder='Enter base ticket price'
                />
              </div>
              <div>
                <label className='block text-sm text-gray-300 mb-2'>👥 Venue Capacity *</label>
                <input 
                  type='number' 
                  min='100' 
                  step='100'
                  className='w-full bg-black/40 rounded p-3 border border-white/20 focus:border-blue-500 focus:outline-none transition-colors' 
                  value={form.capacity} 
                  onChange={e => handleInputChange('capacity', Number(e.target.value))} 
                  placeholder='Enter venue capacity'
                />
              </div>
            </div>
            
            <div>
              <label className='block text-sm text-gray-300 mb-2'>🖼️ Banner Image URL</label>
              <input 
                className='w-full bg-black/40 rounded p-3 border border-white/20 focus:border-blue-500 focus:outline-none transition-colors' 
                value={form.banner_url} 
                onChange={e => handleInputChange('banner_url', e.target.value)} 
                placeholder='https://example.com/image.jpg'
                type='url'
              />
              {form.banner_url && (
                <div className='mt-2'>
                  <img 
                    src={form.banner_url} 
                    alt='Event banner preview' 
                    className='w-full h-32 object-cover rounded border border-white/20'
                    onError={(e) => e.target.style.display = 'none'}
                  />
                </div>
              )}
            </div>
            
            <div>
              <label className='block text-sm text-gray-300 mb-2'>📝 Description</label>
              <textarea 
                rows={4} 
                className='w-full bg-black/40 rounded p-3 border border-white/20 focus:border-blue-500 focus:outline-none transition-colors' 
                value={form.description} 
                onChange={e => handleInputChange('description', e.target.value)} 
                placeholder='Describe your event...'
              />
            </div>
            
            <label className='flex items-center gap-3 text-sm cursor-pointer'>
              <input 
                type='checkbox' 
                checked={form.is_published} 
                onChange={e => handleInputChange('is_published', e.target.checked)} 
                className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
              />
              <span>🚀 Publish event immediately</span>
            </label>
            
            <div className='flex justify-end gap-3'>
              <button 
                type='button'
                onClick={() => setForm({ title: '', date: '', venue: '', genre: 'Cricket', base_price: 1000, capacity: 5000, banner_url: '', description: '', is_published: false })}
                className='px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm font-medium transition-colors'
              >
                🗑️ Clear Form
              </button>
              <button 
                type='submit'
                disabled={loading}
                className='px-6 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dull)] rounded text-sm font-medium disabled:opacity-50 transition-colors'
              >
                {loading ? '💾 Saving...' : '💾 Save Event'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default CreateEvent
