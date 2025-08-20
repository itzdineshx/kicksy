import React from 'react'

const PricingInfo = () => {
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 pt-20 pb-32'>
      <h1 className='text-2xl font-bold text-white mb-4'>Dynamic Pricing Info</h1>
      <p className='text-gray-300 mb-4'>
        Ticket prices may vary based on demand, seat type, event popularity, and time to match.
      </p>
      <ul className='list-disc pl-6 text-gray-300 space-y-2'>
        <li>Platinum: best view and VIP perks</li>
        <li>Gold: balanced view and value</li>
        <li>Regular: budget friendly stands</li>
      </ul>
    </div>
  )
}

export default PricingInfo


