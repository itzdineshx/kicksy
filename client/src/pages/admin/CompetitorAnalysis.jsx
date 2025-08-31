import React, { useState } from 'react';
import AdminNav from '../../components/admin/AdminNav';
import { TrendingUp, Users, DollarSign, Target, Zap, Shield, Star, BarChart3, PieChart, Activity } from 'lucide-react';
import competitorData from '../../data/competitorAnalysis';

const CompetitorAnalysis = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Market Overview', icon: TrendingUp },
    { id: 'competitors', label: 'Competitors', icon: Users },
    { id: 'features', label: 'Feature Comparison', icon: Zap },
    { id: 'pricing', label: 'Pricing Analysis', icon: DollarSign },
    { id: 'advantages', label: 'Our Advantages', icon: Star },
    { id: 'strategy', label: 'Market Strategy', icon: Target }
  ];

  const renderOverview = () => (
    <div className='space-y-6'>
      <div className='grid md:grid-cols-2 gap-6'>
        <div className='bg-[#111] rounded-lg p-6 border border-white/10'>
          <h3 className='text-lg font-semibold mb-4 flex items-center gap-2 text-white'>
            <TrendingUp className='w-5 h-5 text-blue-400' />
            Market Size & Growth
          </h3>
          <div className='space-y-3'>
            <div className='flex justify-between'>
              <span className='text-gray-400'>Total Market Size</span>
              <span className='font-semibold text-white'>{competitorData.marketAnalysis.totalMarketSize}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-400'>Growth Rate</span>
              <span className='font-semibold text-green-400'>{competitorData.marketAnalysis.growthRate}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-400'>Mobile Transactions</span>
              <span className='font-semibold text-blue-400'>85%</span>
            </div>
          </div>
        </div>

        <div className='bg-[#111] rounded-lg p-6 border border-white/10'>
          <h3 className='text-lg font-semibold mb-4 flex items-center gap-2 text-white'>
            <Target className='w-5 h-5 text-green-400' />
            Key Opportunities
          </h3>
          <ul className='space-y-2'>
            {competitorData.marketAnalysis.opportunities.slice(0, 4).map((opportunity, index) => (
              <li key={index} className='flex items-start gap-2'>
                <div className='w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0'></div>
                <span className='text-sm text-gray-300'>{opportunity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className='bg-[#111] rounded-lg p-6 border border-white/10'>
        <h3 className='text-lg font-semibold mb-4 flex items-center gap-2 text-white'>
          <Shield className='w-5 h-5 text-red-400' />
          Market Pain Points
        </h3>
        <div className='grid md:grid-cols-2 gap-4'>
          {competitorData.marketAnalysis.painPoints.map((painPoint, index) => (
            <div key={index} className='flex items-start gap-2'>
              <div className='w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0'></div>
              <span className='text-sm text-gray-300'>{painPoint}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCompetitors = () => (
    <div className='space-y-6'>
      {competitorData.majorCompetitors.map((competitor, index) => (
        <div key={index} className='bg-[#111] rounded-lg p-6 border border-white/10'>
          <div className='flex justify-between items-start mb-4'>
            <div>
              <h3 className='text-xl font-semibold text-white'>{competitor.name}</h3>
              <p className='text-gray-400'>Market Share: {competitor.marketShare}%</p>
            </div>
            <div className='text-right'>
              <p className='text-sm text-gray-400'>Annual Revenue</p>
              <p className='font-semibold text-white'>{competitor.annualRevenue}</p>
            </div>
          </div>

          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <h4 className='font-medium text-green-400 mb-2'>Strengths</h4>
              <ul className='space-y-1'>
                {competitor.strengths.map((strength, idx) => (
                  <li key={idx} className='text-sm text-gray-300 flex items-start gap-2'>
                    <div className='w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0'></div>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className='font-medium text-red-400 mb-2'>Weaknesses</h4>
              <ul className='space-y-1'>
                {competitor.weaknesses.map((weakness, idx) => (
                  <li key={idx} className='text-sm text-gray-300 flex items-start gap-2'>
                    <div className='w-1.5 h-1.5 bg-red-400 rounded-full mt-2 flex-shrink-0'></div>
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className='mt-4 pt-4 border-t border-white/10'>
            <h4 className='font-medium mb-2 text-white'>Pricing Structure</h4>
            <div className='grid grid-cols-3 gap-4 text-sm'>
              <div>
                <span className='text-gray-400'>Commission:</span>
                <span className='ml-2 font-medium text-white'>{competitor.pricing.commission}</span>
              </div>
              <div>
                <span className='text-gray-400'>Booking Fees:</span>
                <span className='ml-2 font-medium text-white'>{competitor.pricing.bookingFees}</span>
              </div>
              <div>
                <span className='text-gray-400'>Payment Gateway:</span>
                <span className='ml-2 font-medium text-white'>{competitor.pricing.paymentGateway}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFeatures = () => (
    <div className='space-y-6'>
      <div className='bg-[#111] rounded-lg p-6 border border-white/10'>
        <h3 className='text-lg font-semibold mb-4 text-white'>Feature Comparison Matrix</h3>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='border-b border-white/10'>
                <th className='text-left py-2 text-gray-300'>Feature</th>
                <th className='text-center py-2 text-gray-300'>BookMyShow</th>
                <th className='text-center py-2 text-gray-300'>Paytm Insider</th>
                <th className='text-center py-2 text-gray-300'>TicketGenie</th>
                <th className='text-center py-2 text-gray-300'>EventsHigh</th>
                <th className='text-center py-2 text-gray-300'>Zomato Live</th>
                <th className='text-center py-2 font-semibold text-blue-400'>Kiccksy</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(competitorData.featureComparison).map(([feature, comparison]) => (
                <tr key={feature} className='border-b border-white/5'>
                  <td className='py-2 font-medium text-white capitalize'>{feature.replace(/([A-Z])/g, ' $1')}</td>
                  {Object.entries(comparison).map(([platform, value]) => (
                    <td key={platform} className={`py-2 text-center ${
                      platform === 'Kiccksy' ? 'font-semibold text-blue-400' : 'text-gray-300'
                    }`}>
                      {typeof value === 'boolean' ? (
                        value ? '✅' : '❌'
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs ${
                          value === 'Excellent' || value === 'Advanced' ? 'bg-green-600/30 text-green-300' :
                          value === 'Good' ? 'bg-blue-600/30 text-blue-300' :
                          value === 'Basic' ? 'bg-yellow-600/30 text-yellow-300' :
                          'bg-gray-600/30 text-gray-300'
                        }`}>
                          {value}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPricing = () => (
    <div className='space-y-6'>
      <div className='grid md:grid-cols-2 gap-6'>
        <div className='bg-[#111] rounded-lg p-6 border border-white/10'>
          <h3 className='text-lg font-semibold mb-4 text-white'>Current Market Pricing</h3>
          <div className='space-y-3'>
            <div className='flex justify-between'>
              <span className='text-gray-400'>Average Commission</span>
              <span className='font-semibold text-white'>{competitorData.pricingAnalysis.averageCommission}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-400'>Average Booking Fees</span>
              <span className='font-semibold text-white'>{competitorData.pricingAnalysis.averageBookingFees}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-400'>Payment Gateway Fees</span>
              <span className='font-semibold text-white'>{competitorData.pricingAnalysis.averagePaymentGatewayFees}</span>
            </div>
            <div className='flex justify-between border-t border-white/10 pt-3'>
              <span className='text-gray-400 font-medium'>Total Cost to Organizer</span>
              <span className='font-semibold text-red-400'>{competitorData.pricingAnalysis.totalCostToOrganizer}</span>
            </div>
          </div>
        </div>

        <div className='bg-[#111] rounded-lg p-6 border border-white/10'>
          <h3 className='text-lg font-semibold mb-4 text-green-400'>Kiccksy Advantage</h3>
          <ul className='space-y-2'>
            {competitorData.pricingAnalysis.kiccksyAdvantage.map((advantage, index) => (
              <li key={index} className='flex items-start gap-2'>
                <div className='w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0'></div>
                <span className='text-sm text-gray-300'>{advantage}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className='bg-[#111] rounded-lg p-6 border border-white/10'>
        <h3 className='text-lg font-semibold mb-4 text-white'>Customer Pain Points</h3>
        <div className='grid md:grid-cols-2 gap-4'>
          {competitorData.pricingAnalysis.customerPainPoints.map((painPoint, index) => (
            <div key={index} className='flex items-start gap-2'>
              <div className='w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0'></div>
              <span className='text-sm text-gray-300'>{painPoint}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAdvantages = () => (
    <div className='space-y-6'>
      {competitorData.competitiveAdvantages.map((category, index) => (
        <div key={index} className='bg-[#111] rounded-lg p-6 border border-white/10'>
          <h3 className='text-lg font-semibold mb-4 flex items-center gap-2 text-white'>
            <Zap className='w-5 h-5 text-blue-400' />
            {category.category}
          </h3>
          <div className='grid md:grid-cols-2 gap-4'>
            {category.advantages.map((advantage, idx) => (
              <div key={idx} className='flex items-start gap-2'>
                <div className='w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0'></div>
                <span className='text-sm text-gray-300'>{advantage}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderStrategy = () => (
    <div className='space-y-6'>
      {Object.entries(competitorData.marketEntryStrategy).map(([phase, details]) => (
        <div key={phase} className='bg-[#111] rounded-lg p-6 border border-white/10'>
          <div className='flex justify-between items-start mb-4'>
            <h3 className='text-lg font-semibold text-white capitalize'>{phase.replace('phase', 'Phase ')}</h3>
            <span className='text-sm text-gray-400 bg-black/20 px-3 py-1 rounded-full border border-white/10'>
              {details.duration}
            </span>
          </div>
          <div className='grid md:grid-cols-2 gap-6'>
            <div>
              <h4 className='font-medium mb-2 text-gray-300'>Focus</h4>
              <p className='text-sm text-gray-400'>{details.focus}</p>
            </div>
            <div>
              <h4 className='font-medium mb-2 text-gray-300'>Target Audience</h4>
              <p className='text-sm text-gray-400'>{details.target}</p>
            </div>
          </div>
          <div className='mt-4'>
            <h4 className='font-medium mb-2 text-gray-300'>Key Metrics</h4>
            <div className='flex flex-wrap gap-2'>
              {details.metrics.map((metric, idx) => (
                <span key={idx} className='text-xs bg-blue-600/30 text-blue-300 px-2 py-1 rounded border border-blue-500/30'>
                  {metric}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'competitors':
        return renderCompetitors();
      case 'features':
        return renderFeatures();
      case 'pricing':
        return renderPricing();
      case 'advantages':
        return renderAdvantages();
      case 'strategy':
        return renderStrategy();
      default:
        return renderOverview();
    }
  };

  return (
    <div className='min-h-screen'>
      <AdminNav />
      <div className='max-w-7xl mx-auto px-6 py-8 text-white'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>Competitor Analysis</h1>
          <div className='flex gap-2'>
            <button 
              onClick={() => window.location.reload()}
              className='px-4 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dull)] rounded text-sm font-medium transition-colors'
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className='bg-[#111] rounded-lg border border-white/10 mb-6'>
          <div className='flex overflow-x-auto'>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400 bg-blue-600/10'
                      : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className='w-4 h-4' />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default CompetitorAnalysis;
