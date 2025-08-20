import React, { useEffect, useState } from 'react'
import AdminNav from '../../components/admin/AdminNav'
import { adminApi } from '../../lib/adminApi'
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient'

const PriceSimulator = () => {
  const [elasticity, setElasticity] = useState({})
  const [simulation, setSimulation] = useState({
    basePrice: 1000,
    baseDemand: 500,
    newPrice: 1200,
    priceChange: 20
  })
  const [results, setResults] = useState(null)
  const [savedTests, setSavedTests] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadElasticity()
    loadSavedTests()
  }, [])

  const loadElasticity = async () => {
    try {
      const { data } = await adminApi.getElasticity()
      if (data) setElasticity(data)
    } catch (error) {
      console.error('Error loading elasticity:', error)
      setError('Failed to load elasticity data')
    }
  }

  const loadSavedTests = async () => {
    if (!isSupabaseConfigured()) return
    try {
      const { data, error } = await supabase.from('price_tests').select('*').order('created_at', { ascending: false }).limit(10)
      if (error) throw error
      if (data) setSavedTests(data)
    } catch (error) {
      console.error('Error loading saved tests:', error)
      setError('Failed to load saved tests')
    }
  }

  const calculateResults = () => {
    const { basePrice, baseDemand, newPrice } = simulation
    const priceElasticity = elasticity.price_elasticity || -1.5 // Default elasticity
    
    const priceRatio = newPrice / basePrice
    const demandChange = Math.pow(priceRatio, priceElasticity)
    const newDemand = Math.round(baseDemand * demandChange)
    
    const baseRevenue = basePrice * baseDemand
    const newRevenue = newPrice * newDemand
    const revenueChange = ((newRevenue - baseRevenue) / baseRevenue * 100)
    
    const demandChangePercent = ((newDemand - baseDemand) / baseDemand * 100)
    
    setResults({
      newDemand,
      newRevenue,
      revenueChange,
      demandChangePercent,
      priceElasticity
    })
  }

  const saveTest = async () => {
    if (!results) return
    setLoading(true)
    try {
      const testData = {
        base_price: simulation.basePrice,
        new_price: simulation.newPrice,
        base_demand: simulation.baseDemand,
        new_demand: results.newDemand,
        revenue_change: results.revenueChange,
        demand_change: results.demandChangePercent,
        elasticity: results.priceElasticity,
        created_at: new Date().toISOString()
      }
      const { error } = await adminApi.insertPriceTest(testData)
      if (error) throw error
      await loadSavedTests()
      setError(null)
      alert('Test saved successfully!')
    } catch (error) {
      console.error('Error saving test:', error)
      setError('Failed to save test')
    } finally {
      setLoading(false)
    }
  }

  const updateElasticity = async (field, value) => {
    const newElasticity = { ...elasticity, [field]: value }
    setElasticity(newElasticity)
    try {
      await adminApi.setElasticity('global', newElasticity)
    } catch (error) {
      console.error('Error updating elasticity:', error)
      setError('Failed to update elasticity')
    }
  }

  const handleSimulationChange = (field, value) => {
    const newSimulation = { ...simulation, [field]: value }
    setSimulation(newSimulation)
    
    // Auto-calculate price change percentage
    if (field === 'newPrice' || field === 'basePrice') {
      const priceChange = ((newSimulation.newPrice - newSimulation.basePrice) / newSimulation.basePrice * 100)
      newSimulation.priceChange = Math.round(priceChange)
    }
    
    setSimulation(newSimulation)
  }

  return (
    <div className='min-h-screen'>
      <AdminNav />
      <div className='max-w-7xl mx-auto px-6 py-8 text-white'>
        <h1 className='text-2xl font-bold mb-6'>Price Simulator</h1>
        
        {error && (
          <div className='bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-6'>
            <p className='text-red-400'>{error}</p>
          </div>
        )}

        <div className='grid lg:grid-cols-2 gap-8'>
          {/* Simulation Panel */}
          <div className='bg-[#111] rounded-lg p-6 border border-white/10'>
            <h2 className='text-lg font-semibold mb-4'>Price Simulation</h2>
            
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>Base Price (₹)</label>
                <input
                  type='number'
                  value={simulation.basePrice}
                  onChange={(e) => handleSimulationChange('basePrice', Number(e.target.value))}
                  className='w-full bg-black/40 rounded p-3 border border-white/20 focus:border-blue-500 focus:outline-none'
                  min='0'
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>Base Demand</label>
                <input
                  type='number'
                  value={simulation.baseDemand}
                  onChange={(e) => handleSimulationChange('baseDemand', Number(e.target.value))}
                  className='w-full bg-black/40 rounded p-3 border border-white/20 focus:border-blue-500 focus:outline-none'
                  min='0'
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>New Price (₹)</label>
                <input
                  type='number'
                  value={simulation.newPrice}
                  onChange={(e) => handleSimulationChange('newPrice', Number(e.target.value))}
                  className='w-full bg-black/40 rounded p-3 border border-white/20 focus:border-blue-500 focus:outline-none'
                  min='0'
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>Price Change (%)</label>
                <input
                  type='number'
                  value={simulation.priceChange}
                  readOnly
                  className='w-full bg-black/40 rounded p-3 border border-white/20 text-gray-400'
                />
              </div>
              
              <button
                onClick={calculateResults}
                className='w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dull)] py-3 rounded font-medium transition-colors'
              >
                Calculate Results
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className='bg-[#111] rounded-lg p-6 border border-white/10'>
            <h2 className='text-lg font-semibold mb-4'>Simulation Results</h2>
            
            {results ? (
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='bg-black/20 rounded p-4'>
                    <p className='text-sm text-gray-400'>New Demand</p>
                    <p className='text-2xl font-semibold text-blue-400'>{results.newDemand}</p>
                  </div>
                  <div className='bg-black/20 rounded p-4'>
                    <p className='text-sm text-gray-400'>New Revenue</p>
                    <p className='text-2xl font-semibold text-green-400'>₹{results.newRevenue.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className='grid grid-cols-2 gap-4'>
                  <div className='bg-black/20 rounded p-4'>
                    <p className='text-sm text-gray-400'>Revenue Change</p>
                    <p className={`text-xl font-semibold ${results.revenueChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {results.revenueChange >= 0 ? '+' : ''}{results.revenueChange.toFixed(1)}%
                    </p>
                  </div>
                  <div className='bg-black/20 rounded p-4'>
                    <p className='text-sm text-gray-400'>Demand Change</p>
                    <p className={`text-xl font-semibold ${results.demandChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {results.demandChangePercent >= 0 ? '+' : ''}{results.demandChangePercent.toFixed(1)}%
                    </p>
                  </div>
                </div>
                
                <div className='bg-black/20 rounded p-4'>
                  <p className='text-sm text-gray-400'>Price Elasticity Used</p>
                  <p className='text-lg font-semibold text-purple-400'>{results.priceElasticity}</p>
                </div>
                
                <button
                  onClick={saveTest}
                  disabled={loading}
                  className='w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 py-3 rounded font-medium transition-colors'
                >
                  {loading ? 'Saving...' : 'Save Test'}
                </button>
              </div>
            ) : (
              <div className='text-center py-8 text-gray-500'>
                <div className='w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center'>
                  <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' />
                  </svg>
                </div>
                <p>Run a simulation to see results</p>
              </div>
            )}
          </div>
        </div>

        {/* Elasticity Settings */}
        <div className='mt-8 bg-[#111] rounded-lg p-6 border border-white/10'>
          <h2 className='text-lg font-semibold mb-4'>Price Elasticity Settings</h2>
          <div className='grid md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>Price Elasticity</label>
              <input
                type='number'
                value={elasticity.price_elasticity || -1.5}
                onChange={(e) => updateElasticity('price_elasticity', Number(e.target.value))}
                className='w-full bg-black/40 rounded p-3 border border-white/20 focus:border-blue-500 focus:outline-none'
                step='0.1'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-2'>Demand Elasticity</label>
              <input
                type='number'
                value={elasticity.demand_elasticity || -1.2}
                onChange={(e) => updateElasticity('demand_elasticity', Number(e.target.value))}
                className='w-full bg-black/40 rounded p-3 border border-white/20 focus:border-blue-500 focus:outline-none'
                step='0.1'
              />
            </div>
          </div>
        </div>

        {/* Saved Tests */}
        <div className='mt-8 bg-[#111] rounded-lg p-6 border border-white/10'>
          <h2 className='text-lg font-semibold mb-4'>Saved Tests</h2>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-white/10'>
                  <th className='text-left py-2'>Base Price</th>
                  <th className='text-left py-2'>New Price</th>
                  <th className='text-left py-2'>Base Demand</th>
                  <th className='text-left py-2'>New Demand</th>
                  <th className='text-left py-2'>Revenue Change</th>
                  <th className='text-left py-2'>Date</th>
                </tr>
              </thead>
              <tbody>
                {savedTests.map((test, index) => (
                  <tr key={index} className='border-b border-white/5 hover:bg-black/20'>
                    <td className='py-2'>₹{test.base_price}</td>
                    <td className='py-2'>₹{test.new_price}</td>
                    <td className='py-2'>{test.base_demand}</td>
                    <td className='py-2'>{test.new_demand}</td>
                    <td className={`py-2 ${test.revenue_change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {test.revenue_change >= 0 ? '+' : ''}{test.revenue_change?.toFixed(1)}%
                    </td>
                    <td className='py-2 text-gray-400'>
                      {new Date(test.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {savedTests.length === 0 && (
              <div className='text-center py-8 text-gray-500'>
                <p>No saved tests yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PriceSimulator


