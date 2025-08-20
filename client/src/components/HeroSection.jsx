import React from 'react'
import { ArrowRight, Calendar, IndianRupee, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
    const navigate = useNavigate()
  return (
    <div
      className='relative h-screen bg-cover bg-center flex items-center text-white px-6 md:px-20'
      style={{ backgroundImage: "url('/images/hero-football.jpg')" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/10 z-0" />

      <div className="relative z-10 max-w-3xl">
        <div className="flex gap-2 items-center mb-2">
          <span className="bg-red-600 text-white text-sm px-3 py-1 rounded-full">Football</span>
          <span className="bg-yellow-500 text-white text-sm px-2 py-1 rounded-full">Upcoming</span>
          <span className="flex items-center gap-1 text-sm">
            ⭐ 4.8
          </span>
        </div>

        <h1 className="text-5xl font-extrabold mb-3">India Vs Portugal</h1>
        <p className="text-xl font-light mb-4">International Friendly | Star Players | FIFA</p>

        <div className="flex gap-4 items-center text-sm mb-5">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Aug 10, 2025
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            Chennai
          </div>
          <div className="flex items-center gap-1">
            <IndianRupee className="w-4 h-4" />
            1200
          </div>

        </div>
        <button onClick={()=> navigate('/Events')} className='flex items-center gap-1 px-5 py-3 text-sm bg-[var(--color-primary)] hover:bg-[var(--color-primary-dull)] transition rounded-full font-medium cursor-pointer'>
            Get Tickets 
        <ArrowRight className='group-hover:translate-x-0.5 transition w-4.5 h-4.5'/>
        </button>       
        </div>
        
      </div>

  )
}

export default HeroSection
