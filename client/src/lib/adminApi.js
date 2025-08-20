import { supabase, isSupabaseConfigured } from './supabaseClient'
const API_BASE = import.meta.env.VITE_API_URL || ''
import { dummyBookingData } from '../data/assests'

export const adminApi = {
  // Segments
  async listSegments() {
    if (!isSupabaseConfigured()) return { data: [], error: null }
    return await supabase.from('segments').select('*').order('share', { ascending: false })
  },
  async upsertSegment(segment) {
    if (!isSupabaseConfigured()) return { data: null, error: new Error('Supabase not configured') }
    return await supabase.from('segments').upsert(segment, { onConflict: 'name' })
  },
  async deleteSegment(segmentName) {
    if (!isSupabaseConfigured()) return { data: null, error: new Error('Supabase not configured') }
    return await supabase.from('segments').delete().eq('name', segmentName)
  },

  // Pricing Rules (seat/genre/time based)
  async listPricingRules() {
    if (!isSupabaseConfigured()) {
      return { data: [
        { id: 'r1', name: 'Cricket surge', priority: 10, genre: 'Cricket', seat_type: 'Platinum', date_before_days: 7, price_multiplier: 1.2, is_active: true },
        { id: 'r2', name: 'Early bird', priority: 50, genre: '', seat_type: '', date_before_days: 30, price_multiplier: 0.9, is_active: true },
      ], error: null }
    }
    return await supabase.from('pricing_rules').select('*').order('priority', { ascending: true })
  },
  async upsertPricingRule(rule) {
    if (!isSupabaseConfigured()) {
      const id = rule.id || `mock-${Date.now()}`
      return { data: { ...rule, id }, error: null }
    }
    return await supabase.from('pricing_rules').upsert(rule).select().single()
  },
  async deletePricingRule(id) {
    if (!isSupabaseConfigured()) {
      return { data: { id }, error: null }
    }
    return await supabase.from('pricing_rules').delete().eq('id', id)
  },

  // Elasticity (store a single global row or per-key row)
  async getElasticity(key = 'global') {
    if (!isSupabaseConfigured()) return { data: { price_elasticity: -1.4, demand_elasticity: -1.2 }, error: null }
    const { data, error } = await supabase.from('elasticity').select('*').eq('key', key).maybeSingle()
    return { data, error }
  },
  async setElasticity(key = 'global', value) {
    if (!isSupabaseConfigured()) return { data: { key, value }, error: null }
    return await supabase.from('elasticity').upsert({ key, value })
  },

  // Historical Demand + Forecasts
  async insertHistoricalDemand(rows) {
    if (!isSupabaseConfigured()) return { data: { inserted: rows.length }, error: null }
    return await supabase.from('historical_demand').insert(rows)
  },
  async listForecasts(limit = 50) {
    if (!isSupabaseConfigured()) return { data: [], error: null }
    return await supabase.from('forecasts').select('*').order('for_date', { ascending: true }).limit(limit)
  },
  async upsertForecasts(rows) {
    if (!isSupabaseConfigured()) return { data: { upserted: rows.length }, error: null }
    return await supabase.from('forecasts').upsert(rows, { onConflict: 'for_date' })
  },

  // Price test logs
  async insertPriceTest(test) {
    if (!isSupabaseConfigured()) return { data: { ...test, id: `mock-${Date.now()}` }, error: null }
    return await supabase.from('price_tests').insert(test)
  },

  // Pricing recommendations
  async insertPricingRecommendation(row) {
    if (!isSupabaseConfigured()) return { data: { ...row, id: `mock-${Date.now()}` }, error: null }
    return await supabase.from('pricing_recommendations').insert(row).select().single()
  },
  async listPricingRecommendations(eventId, limit = 50) {
    if (!isSupabaseConfigured()) return { data: [], error: null }
    let q = supabase.from('pricing_recommendations').select('*').order('created_at', { ascending: false }).limit(limit)
    if (eventId) q = q.eq('event_id', eventId)
    return await q
  },

  // Bookings analytics (proxy)
  async bookingsByGenre() {
    if (!isSupabaseConfigured()) {
      const counts = {}
      for (const b of (dummyBookingData || [])) {
        const g = b.show?.movie?.genre || 'unknown'
        counts[g] = (counts[g] || 0) + 1
      }
      const result = Object.entries(counts).map(([genre, count]) => ({ genre, count }))
      return { data: result, error: null }
    }
    const { data, error } = await supabase
      .from('bookings')
      .select('payload')
      .limit(1000)
    if (error) return { data: [], error }
    const counts = {}
    for (const row of data) {
      const g = row.payload?.genre || 'unknown'
      counts[g] = (counts[g] || 0) + 1
    }
    const result = Object.entries(counts).map(([genre, count]) => ({ genre, count }))
    return { data: result, error: null }
  },

  async getRevenueData() {
    if (!isSupabaseConfigured()) {
      const map = new Map()
      for (const b of (dummyBookingData || [])) {
        const d = (b.show?.showDateTime || new Date().toISOString()).slice(0,10)
        const amount = b.amount || (b.bookedSeats?.length || 1) * (b.show?.showPrice || 0)
        map.set(d, (map.get(d) || 0) + amount)
      }
      const arr = Array.from(map.entries()).map(([date, revenue]) => ({ date, revenue }))
      arr.sort((a,b) => a.date.localeCompare(b.date))
      return { data: arr }
    }
    try {
      const mockData = [
        { date: '2024-01-15', revenue: 45000 },
        { date: '2024-01-16', revenue: 52000 },
        { date: '2024-01-17', revenue: 38000 },
        { date: '2024-01-18', revenue: 61000 },
        { date: '2024-01-19', revenue: 49000 },
        { date: '2024-01-20', revenue: 55000 },
        { date: '2024-01-21', revenue: 42000 },
      ]
      return { data: mockData }
    } catch (error) {
      console.error('Error fetching revenue data:', error)
      return { data: [] }
    }
  },

  async getDailyBookingCounts() {
    if (!isSupabaseConfigured()) {
      const map = new Map()
      for (const b of (dummyBookingData || [])) {
        const d = (b.show?.showDateTime || new Date().toISOString()).slice(0,10)
        map.set(d, (map.get(d) || 0) + 1)
      }
      const arr = Array.from(map.entries()).map(([date, count]) => ({ date, count }))
      arr.sort((a,b) => a.date.localeCompare(b.date))
      return { data: arr, error: null }
    }
    // Supabase version (example): counts per day
    const { data, error } = await supabase.rpc('daily_booking_counts')
    return { data: data || [], error }
  },

  // Payments: create order (expects backend function)
  async createRazorpayOrder(amountInPaise, currency = 'INR', receipt = undefined) {
    const url = `${API_BASE}/api/create-razorpay-order`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: amountInPaise, currency, receipt }),
    })
    if (!res.ok) throw new Error('Failed to create order')
    return res.json()
  },

  // Server-driven batch pricing
  async runPricingBatch(limit = 5) {
    const url = `${API_BASE}/api/run-pricing-batch`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ limit }),
    })
    if (!res.ok) throw new Error('Batch run failed')
    return res.json()
  },

  async applyPriceOverride(eventId, seatType, price, appliedBy = 'admin', reason = '') {
    const url = `${API_BASE}/api/apply-price-override`
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_id: eventId, seat_type: seatType, applied_price: price, applied_by: appliedBy, reason }),
    })
    if (!res.ok) throw new Error('Apply override failed')
    return res.json()
  },
}


