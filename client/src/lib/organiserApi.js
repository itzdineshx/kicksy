import { supabase, isSupabaseConfigured } from './supabaseClient'
import { dummyShowsData, dummyBookingData } from '../data/assests'

export const organiserApi = {
  // Events CRUD
  async listEvents(limit = 100) {
    if (!isSupabaseConfigured()) {
      const mapped = (dummyShowsData || []).slice(0, limit).map((s, idx) => ({
        id: s._id || s.id || `dummy-${idx}`,
        title: s.title,
        date: s.date,
        venue: s.location,
        genre: (s.genre || '').charAt(0).toUpperCase() + (s.genre || '').slice(1),
        base_price: (s.seatTypes && s.seatTypes.find(t => t.type?.toLowerCase() === 'regular')?.price) || 1000,
        capacity: 5000,
        banner_url: s.backdrop_path || s.poster_path || '',
        description: s.tagline || s.overview || '',
        is_published: true,
      }))
      return { data: mapped, error: null }
    }
    return await supabase.from('events').select('*').order('date', { ascending: true }).limit(limit)
  },
  async upsertEvent(event) {
    if (!isSupabaseConfigured()) return { data: null, error: new Error('Supabase not configured') }
    return await supabase.from('events').upsert(event).select().single()
  },
  async deleteEvent(id) {
    if (!isSupabaseConfigured()) return { data: null, error: new Error('Supabase not configured') }
    return await supabase.from('events').delete().eq('id', id)
  },

  // Bookings for organiser (basic example)
  async listBookings(limit = 200) {
    if (!isSupabaseConfigured()) {
      const mapped = (dummyBookingData || []).slice(0, limit).map((b, idx) => ({
        id: b._id || `book-${idx}`,
        created_at: b.show?.showDateTime || new Date().toISOString(),
        amount: b.amount || (b.bookedSeats?.length || 1) * (b.show?.showPrice || 0),
        payload: {
          genre: b.show?.movie?.genre || '-',
          event_title: b.show?.movie?.title || '-',
        },
      }))
      return { data: mapped, error: null }
    }
    const { data, error } = await supabase
      .from('bookings')
      .select('id, created_at, amount, payload')
      .order('created_at', { ascending: false })
      .limit(limit)
    return { data: data || [], error }
  },
}
