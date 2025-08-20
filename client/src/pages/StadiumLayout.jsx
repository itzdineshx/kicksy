import React from 'react'

const sectors = [
  { name: 'Platinum', color: '#8B5CF6', price: 3500, perks: ['VIP seating', 'Free drinks'] },
  { name: 'Gold', color: '#F59E0B', price: 2500, perks: ['Better view'] },
  { name: 'Regular', color: '#6B7280', price: 800, perks: ['Standard'] },
]

const StadiumLayout = () => {
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 pt-20 pb-32'>
      <h1 className='text-2xl font-bold text-white mb-6'>Stadium Layout</h1>
      <div className='bg-[#111] rounded-lg border border-white/10 p-6'>
        <div className='grid md:grid-cols-2 gap-6 items-center'>
          <div className='aspect-square w-full bg-black/40 rounded-lg grid place-items-center text-gray-400'>
            Seating map placeholder
          </div>
          <div className='space-y-4'>
            {sectors.map(s => (
              <div key={s.name} className='flex items-start gap-3'>
                <span className='mt-1 inline-block w-3 h-3 rounded-sm' style={{ background: s.color }} />
                <div>
                  <p className='font-semibold'>{s.name} — ₹{s.price}</p>
                  <p className='text-sm text-gray-400'>{s.perks.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StadiumLayout