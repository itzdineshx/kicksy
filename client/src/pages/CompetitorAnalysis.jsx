import React, { useState } from 'react';
import { ArrowLeft, TrendingUp, Users, DollarSign, Target, Zap, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import competitorData from '../data/competitorAnalysis';

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
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Market Size & Growth
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Market Size</span>
              <span className="font-semibold">{competitorData.marketAnalysis.totalMarketSize}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Growth Rate</span>
              <span className="font-semibold text-green-600">{competitorData.marketAnalysis.growthRate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Mobile Transactions</span>
              <span className="font-semibold">85%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-500" />
            Key Opportunities
          </h3>
          <ul className="space-y-2">
            {competitorData.marketAnalysis.opportunities.slice(0, 4).map((opportunity, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-700">{opportunity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-red-500" />
          Market Pain Points
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {competitorData.marketAnalysis.painPoints.map((painPoint, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm text-gray-700">{painPoint}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCompetitors = () => (
    <div className="space-y-6">
      {competitorData.majorCompetitors.map((competitor, index) => (
        <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-semibold">{competitor.name}</h3>
              <p className="text-gray-600">Market Share: {competitor.marketShare}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Annual Revenue</p>
              <p className="font-semibold">{competitor.annualRevenue}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-green-600 mb-2">Strengths</h4>
              <ul className="space-y-1">
                {competitor.strengths.map((strength, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-red-600 mb-2">Weaknesses</h4>
              <ul className="space-y-1">
                {competitor.weaknesses.map((weakness, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <h4 className="font-medium mb-2">Pricing Structure</h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Commission:</span>
                <span className="ml-2 font-medium">{competitor.pricing.commission}</span>
              </div>
              <div>
                <span className="text-gray-600">Booking Fees:</span>
                <span className="ml-2 font-medium">{competitor.pricing.bookingFees}</span>
              </div>
              <div>
                <span className="text-gray-600">Payment Gateway:</span>
                <span className="ml-2 font-medium">{competitor.pricing.paymentGateway}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFeatures = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Feature Comparison Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Feature</th>
                <th className="text-center py-2">BookMyShow</th>
                <th className="text-center py-2">Paytm Insider</th>
                <th className="text-center py-2">TicketGenie</th>
                <th className="text-center py-2">EventsHigh</th>
                <th className="text-center py-2">Zomato Live</th>
                <th className="text-center py-2 font-semibold text-blue-600">Kiccksy</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(competitorData.featureComparison).map(([feature, comparison]) => (
                <tr key={feature} className="border-b">
                  <td className="py-2 font-medium capitalize">{feature.replace(/([A-Z])/g, ' $1')}</td>
                  {Object.entries(comparison).map(([platform, value]) => (
                    <td key={platform} className={`py-2 text-center ${
                      platform === 'Kiccksy' ? 'font-semibold text-blue-600' : ''
                    }`}>
                      {typeof value === 'boolean' ? (
                        value ? '✅' : '❌'
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs ${
                          value === 'Excellent' || value === 'Advanced' ? 'bg-green-100 text-green-800' :
                          value === 'Good' ? 'bg-blue-100 text-blue-800' :
                          value === 'Basic' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
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
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Current Market Pricing</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Average Commission</span>
              <span className="font-semibold">{competitorData.pricingAnalysis.averageCommission}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Booking Fees</span>
              <span className="font-semibold">{competitorData.pricingAnalysis.averageBookingFees}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Gateway Fees</span>
              <span className="font-semibold">{competitorData.pricingAnalysis.averagePaymentGatewayFees}</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-gray-600 font-medium">Total Cost to Organizer</span>
              <span className="font-semibold text-red-600">{competitorData.pricingAnalysis.totalCostToOrganizer}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 text-green-600">Kiccksy Advantage</h3>
          <ul className="space-y-2">
            {competitorData.pricingAnalysis.kiccksyAdvantage.map((advantage, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-700">{advantage}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Customer Pain Points</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {competitorData.pricingAnalysis.customerPainPoints.map((painPoint, index) => (
            <div key={index} className="flex items-start gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-sm text-gray-700">{painPoint}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAdvantages = () => (
    <div className="space-y-6">
      {competitorData.competitiveAdvantages.map((category, index) => (
        <div key={index} className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            {category.category}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {category.advantages.map((advantage, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-700">{advantage}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderStrategy = () => (
    <div className="space-y-6">
      {Object.entries(competitorData.marketEntryStrategy).map(([phase, details]) => (
        <div key={phase} className="bg-white rounded-lg p-6 shadow-sm border">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold capitalize">{phase.replace('phase', 'Phase ')}</h3>
            <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {details.duration}
            </span>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Focus</h4>
              <p className="text-sm text-gray-700">{details.focus}</p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Target Audience</h4>
              <p className="text-sm text-gray-700">{details.target}</p>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="font-medium mb-2">Key Metrics</h4>
            <div className="flex flex-wrap gap-2">
              {details.metrics.map((metric, idx) => (
                <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-2xl font-bold text-gray-900">Competitor Analysis</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
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
