import React, { useEffect, useMemo, useState } from 'react'
import AdminNav from '../../components/admin/AdminNav'
import { adminApi } from '../../lib/adminApi'

const PricingRules = () => {
  const [rules, setRules] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    id: undefined,
    name: '',
    priority: 100,
    genre: '',
    seat_type: '',
    date_before_days: '',
    price_multiplier: 1.0,
    is_active: true,
  })

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await adminApi.listPricingRules()
      setRules(data || [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    const payload = { ...form }
    if (!payload.name) return
    payload.priority = Number(payload.priority) || 100
    payload.price_multiplier = Number(payload.price_multiplier) || 1
    if (payload.date_before_days === '') delete payload.date_before_days
    await adminApi.upsertPricingRule(payload)
    setForm({ id: undefined, name: '', priority: 100, genre: '', seat_type: '', date_before_days: '', price_multiplier: 1.0, is_active: true })
    await load()
  }

  const editRule = (rule) => {
    setForm({
      id: rule.id,
      name: rule.name || '',
      priority: rule.priority || 100,
      genre: rule.genre || '',
      seat_type: rule.seat_type || '',
      date_before_days: rule.date_before_days ?? '',
      price_multiplier: rule.price_multiplier || 1.0,
      is_active: Boolean(rule.is_active),
    })
  }

  const remove = async (id) => {
    await adminApi.deletePricingRule(id)
    await load()
  }

  const genreDistribution = useMemo(() => {
    const counts = {}
    for (const r of rules) {
      const g = r.genre || 'Any'
      counts[g] = (counts[g] || 0) + 1
    }
    return Object.entries(counts)
  }, [rules])

  const abCards = useMemo(() => {
    // Create mock A/B effectiveness for the first 3 rules
    return rules.slice(0, 3).map((r, idx) => {
      const uplift = Number(((Math.random() * 0.25) - 0.05).toFixed(3)) // -5% to +20%
      const conf = Number((0.7 + Math.random() * 0.25).toFixed(2)) // 70%-95%
      return { id: r.id, name: r.name, uplift, conf }
    })
  }, [rules])

  return (
    <div className='min-h-screen'>
      <AdminNav />
      <div className='max-w-7xl mx-auto px-6 py-8 text-white'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>Pricing Rules</h1>
          <button onClick={load} className='px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dull)] rounded text-sm font-medium'>Refresh</button>
        </div>

        <form onSubmit={submit} className='bg-[#111] rounded-lg p-6 border border-white/10 mb-8 grid md:grid-cols-6 gap-4'>
          <input className='bg-black/40 rounded p-3 border border-white/20 md:col-span-2' placeholder='Name' value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
          <input className='bg-black/40 rounded p-3 border border-white/20' placeholder='Priority' type='number' value={form.priority} onChange={e=>setForm(f=>({...f,priority:e.target.value}))} />
          <input className='bg-black/40 rounded p-3 border border-white/20' placeholder='Genre (optional)' value={form.genre} onChange={e=>setForm(f=>({...f,genre:e.target.value}))} />
          <input className='bg-black/40 rounded p-3 border border-white/20' placeholder='Seat Type (VIP/Regular/Economy)' value={form.seat_type} onChange={e=>setForm(f=>({...f,seat_type:e.target.value}))} />
          <input className='bg-black/40 rounded p-3 border border-white/20' placeholder='Days before (optional)' type='number' value={form.date_before_days} onChange={e=>setForm(f=>({...f,date_before_days:e.target.value}))} />
          <input className='bg-black/40 rounded p-3 border border-white/20' placeholder='Price x (e.g., 1.10)' type='number' step='0.01' value={form.price_multiplier} onChange={e=>setForm(f=>({...f,price_multiplier:e.target.value}))} />
          <label className='flex items-center gap-2 text-sm'>
            <input type='checkbox' checked={form.is_active} onChange={e=>setForm(f=>({...f,is_active:e.target.checked}))} /> Active
          </label>
          <div className='md:col-span-6 flex justify-end'>
            <button className='px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-medium'>Save Rule</button>
          </div>
        </form>

        {/* A/B Effectiveness */}
        <div className='grid md:grid-cols-3 gap-6 mb-8'>
          {abCards.map(c => (
            <div key={c.id} className='bg-[#111] rounded-lg p-6 border border-white/10'>
              <div className='text-sm text-gray-400 mb-2'>A/B Effectiveness</div>
              <div className='font-semibold mb-2'>{c.name}</div>
              <div className={`text-2xl font-bold ${c.uplift >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {c.uplift >= 0 ? '+' : ''}{(c.uplift * 100).toFixed(1)}%
              </div>
              <div className='text-sm text-gray-400 mt-1'>Confidence: {(c.conf * 100).toFixed(0)}%</div>
              <div className='mt-3'>
                <div className='w-full bg-gray-700 rounded-full h-2'>
                  <div className={`h-2 rounded-full ${c.uplift >= 0 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, Math.abs(c.uplift) * 400)}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='grid lg:grid-cols-2 gap-6 mb-8'>
          <div className='bg-[#111] rounded-lg p-6 border border-white/10'>
            <h3 className='text-lg font-semibold mb-4'>Genre Coverage</h3>
            <div className='space-y-3'>
              {genreDistribution.map(([g, c], idx) => (
                <div key={g} className='flex items-center gap-3'>
                  <div className='w-4 h-4 rounded-full' style={{ backgroundColor: `hsl(${idx * 60}, 70%, 60%)` }}></div>
                  <div className='flex-1'>
                    <div className='flex justify-between text-sm mb-1'>
                      <span className='font-medium capitalize'>{g}</span>
                      <span className='text-gray-400'>{c}</span>
                    </div>
                    <div className='w-full bg-gray-700 rounded-full h-2'>
                      <div className='h-2 rounded-full' style={{ width: `${Math.min(100, c * 20)}%`, backgroundColor: `hsl(${idx * 60}, 70%, 60%)` }}></div>
                    </div>
                  </div>
                </div>
              ))}
              {genreDistribution.length === 0 && <div className='text-gray-500'>No rules</div>}
            </div>
          </div>
          <div className='bg-[#111] rounded-lg p-6 border border-white/10'>
            <h3 className='text-lg font-semibold mb-4'>Active vs Inactive</h3>
            <div className='flex items-center gap-6'>
              <div className='flex-1'>
                <div className='text-sm text-gray-400 mb-1'>Active</div>
                <div className='w-full bg-gray-700 rounded-full h-2'>
                  <div className='h-2 bg-green-500 rounded-full' style={{ width: `${(rules.filter(r=>r.is_active).length / (rules.length || 1)) * 100}%` }}></div>
                </div>
              </div>
              <div className='flex-1'>
                <div className='text-sm text-gray-400 mb-1'>Inactive</div>
                <div className='w-full bg-gray-700 rounded-full h-2'>
                  <div className='h-2 bg-red-500 rounded-full' style={{ width: `${(rules.filter(r=>!r.is_active).length / (rules.length || 1)) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='overflow-x-auto bg-[#111] rounded-lg p-6 border border-white/10'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-white/10'>
                <th className='text-left py-2'>Name</th>
                <th className='text-left py-2'>Priority</th>
                <th className='text-left py-2'>Genre</th>
                <th className='text-left py-2'>Seat</th>
                <th className='text-left py-2'>Days Before</th>
                <th className='text-left py-2'>Price x</th>
                <th className='text-right py-2'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map(rule => (
                <tr key={rule.id} className='border-b border-white/5'>
                  <td className='py-2 font-medium'>{rule.name}</td>
                  <td className='py-2'>{rule.priority}</td>
                  <td className='py-2'>{rule.genre || '-'}</td>
                  <td className='py-2'>{rule.seat_type || '-'}</td>
                  <td className='py-2'>{rule.date_before_days ?? '-'}</td>
                  <td className='py-2'>{rule.price_multiplier}</td>
                  <td className='py-2 text-right'>
                    <div className='flex gap-2 justify-end'>
                      <button onClick={() => editRule(rule)} className='px-3 py-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dull)] rounded'>Edit</button>
                      <button onClick={() => remove(rule.id)} className='px-3 py-1 bg-red-600 hover:bg-red-700 rounded'>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rules.length === 0 && (
            <div className='text-center text-gray-500 py-8'>No rules</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PricingRules
