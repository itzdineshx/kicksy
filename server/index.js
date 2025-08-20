/* eslint-env node */
/* Simple Express server for Razorpay order creation and verification */
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Razorpay from 'razorpay'
import crypto from 'crypto'

dotenv.config()

const app = express()

// CORS
const allowedOrigin = process.env?.CLIENT_ORIGIN || '*'
app.use(cors({ origin: allowedOrigin }))
app.use(express.json())

// process is a Node global; declare for eslint when using ESM
/* global process */
const key_id = (typeof process !== 'undefined' && process.env?.RAZORPAY_KEY_ID) || (typeof process !== 'undefined' && process.env?.VITE_RAZORPAY_KEY_ID)
const key_secret = typeof process !== 'undefined' ? process.env?.RAZORPAY_KEY_SECRET : undefined

// ML + Supabase env
const ML_API_URL = process.env?.ML_API_URL || 'http://localhost:8000'
const SUPABASE_URL = process.env?.SUPABASE_URL || ''
const SUPABASE_SERVICE_KEY = process.env?.SUPABASE_SERVICE_KEY || ''

if (!key_id || !key_secret) {
  console.warn('Razorpay keys are not fully configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env')
}

const razorpay = new Razorpay({ key_id, key_secret })

// Basic health and config routes
app.get('/api/health', (req, res) => {
  return res.json({ status: 'ok', time: new Date().toISOString() })
})

app.get('/api/config', (req, res) => {
  return res.json({ razorpay_key_id: key_id || null })
})

app.post('/api/create-razorpay-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body || {}
    if (!amount || Number.isNaN(Number(amount))) {
      return res.status(400).json({ error: 'Invalid amount' })
    }
    const order = await razorpay.orders.create({ amount: Number(amount), currency, receipt })
    return res.json(order)
  } catch (err) {
    console.error('create-razorpay-order error', err)
    return res.status(500).json({ error: 'Failed to create order' })
  }
})

app.post('/api/verify-razorpay', async (req, res) => {
  try {
    const { order_id, payment_id, signature } = req.body || {}
    if (!order_id || !payment_id || !signature) {
      return res.status(400).json({ verified: false, error: 'Missing params' })
    }
    const hmac = crypto.createHmac('sha256', key_secret)
    hmac.update(`${order_id}|${payment_id}`)
    const digest = hmac.digest('hex')
    const verified = digest === signature
    return res.json({ verified })
  } catch (err) {
    console.error('verify-razorpay error', err)
    return res.status(500).json({ verified: false, error: 'Verification failed' })
  }
})

// Minimal in-memory bookings for demo
const memoryBookings = new Map()

app.post('/api/bookings', (req, res) => {
  const booking = req.body || {}
  const id = booking.id || `bk_${Date.now()}_${Math.floor(Math.random() * 1e6)}`
  const saved = { id, created_at: new Date().toISOString(), ...booking }
  memoryBookings.set(id, saved)
  return res.status(201).json(saved)
})

app.get('/api/bookings/:id', (req, res) => {
  const item = memoryBookings.get(req.params.id)
  if (!item) return res.status(404).json({ error: 'Not found' })
  return res.json(item)
})

// --- Pricing batch runner ---
async function listUpcomingEvents(limit = 5) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return []
  const headers = { 'apikey': SUPABASE_SERVICE_KEY, 'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}` }
  const url = `${SUPABASE_URL}/rest/v1/events?select=*&order=date.asc&limit=${limit}`
  const r = await fetch(url, { headers })
  if (!r.ok) throw new Error('Failed to fetch events')
  return await r.json()
}

function daysUntil(dateStr) {
  const today = new Date()
  const d = new Date(dateStr)
  const diffMs = d - today
  return Math.max(0, Math.round(diffMs / (1000*60*60*24)))
}

async function recommendForEvent(ev) {
  const seatCategories = ['General', 'Premium', 'VIP', 'Corporate Box']
  const recs = []
  for (const seat of seatCategories) {
    const payload = {
      domain: {
        league_code: 1,
        team_home_code: 1,
        team_away_code: 2,
        stadium_code: 1,
        city_code: 1,
        seat_category: seat,
        weather_code: 1,
        demand_level: 'Medium',
        days_before_match: daysUntil(ev.date || new Date().toISOString()),
        base_price: Number(ev.base_price || 1000),
        popular_matchup: false,
      },
      price_min: 200,
      price_max: 15000,
      price_step: 100,
    }
    const r = await fetch(`${ML_API_URL}/recommend/price_from_domain`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    })
    if (!r.ok) throw new Error('ML recommend failed')
    const data = await r.json()
    recs.push({
      seat_type: seat,
      recommended_price: Number(data.recommended_price),
      expected_demand: Number(data.expected_demand),
      expected_revenue: Number(data.expected_revenue),
      model_name: data.model || null,
      features: payload,
    })
  }
  return recs
}

async function insertRecommendations(eventId, recs) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return { inserted: 0 }
  const headers = {
    'apikey': SUPABASE_SERVICE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json'
  }
  const rows = recs.map(r => ({
    event_id: String(eventId),
    seat_type: r.seat_type,
    recommended_price: r.recommended_price,
    expected_demand: r.expected_demand,
    expected_revenue: r.expected_revenue,
    model_name: r.model_name,
    features: r.features,
  }))
  const r = await fetch(`${SUPABASE_URL}/rest/v1/pricing_recommendations`, { method: 'POST', headers, body: JSON.stringify(rows) })
  if (!r.ok) throw new Error('Failed to insert recommendations')
  return { inserted: rows.length }
}

app.post('/api/run-pricing-batch', async (req, res) => {
  try {
    const limit = Number(req.body?.limit || 5)
    const events = await listUpcomingEvents(limit)
    let total = 0
    for (const ev of events) {
      const recs = await recommendForEvent(ev)
      await insertRecommendations(ev.id || ev.event_id, recs)
      total += recs.length
    }
    return res.json({ processed_events: events.length, inserted: total })
  } catch (err) {
    console.error('run-pricing-batch error', err)
    return res.status(500).json({ error: 'Batch failed' })
  }
})

app.post('/api/apply-price-override', async (req, res) => {
  try {
    const { event_id, seat_type, applied_price, reason, applied_by } = req.body || {}
    if (!event_id || !seat_type || !applied_price) {
      return res.status(400).json({ error: 'Missing params' })
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return res.status(500).json({ error: 'Supabase not configured' })
    }
    const headers = {
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates'
    }
    const row = [{ event_id: String(event_id), seat_type, applied_price: Number(applied_price), reason: reason || null, applied_by: applied_by || null }]
    const r = await fetch(`${SUPABASE_URL}/rest/v1/price_overrides`, { method: 'POST', headers, body: JSON.stringify(row) })
    if (!r.ok) {
      const txt = await r.text()
      throw new Error(`Upsert failed: ${txt}`)
    }
    return res.json({ ok: true })
  } catch (err) {
    console.error('apply-price-override error', err)
    return res.status(500).json({ error: 'Apply failed' })
  }
})

const PORT = (typeof process !== 'undefined' && process.env?.PORT) || 8787
console.log('Using Razorpay key_id:', key_id ? key_id.slice(0,4) + '****' : 'MISSING')
app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`)
})


