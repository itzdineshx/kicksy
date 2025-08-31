import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Pages
import Home from './pages/Home'
import Events from './pages/Events'
import EventDetails from './pages/EventDetails'
import Venues from './pages/Venues'
import News from './pages/News'
import Bookings from './pages/Bookings';
import MyBookings from './pages/MyBookings';
import PricingInfo from './pages/PricingInfo';
import OrderSummary from './pages/OrderSummary';
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Privacy from './pages/Privacy';
import CompetitorAnalysis from './pages/CompetitorAnalysis';
import AdminCompetitorAnalysis from './pages/admin/CompetitorAnalysis';

// Components
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { lazy, Suspense } from 'react'
const PricingDashboard = lazy(() => import('./pages/admin/PricingDashboard'))
const PriceSimulator = lazy(() => import('./pages/admin/PriceSimulator'))
const DemandForecast = lazy(() => import('./pages/admin/DemandForecast'))
const CustomerSegments = lazy(() => import('./pages/admin/CustomerSegments'))
const RevenueAnalytics = lazy(() => import('./pages/admin/RevenueAnalytics'))
const PricingRules = lazy(() => import('./pages/admin/PricingRules'))

// Organiser
const OrganiserDashboard = lazy(() => import('./pages/organiser/Dashboard'))
const OrganiserEvents = lazy(() => import('./pages/organiser/Events'))
const OrganiserCreateEvent = lazy(() => import('./pages/organiser/CreateEvent'))
const OrganiserBookings = lazy(() => import('./pages/organiser/Bookings'))



const App = () => {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isOrganiserRoute = location.pathname.startsWith('/organiser')

  return (
    <>
      <Toaster />
      {!isAdminRoute && !isOrganiserRoute && <Navbar />}
      <Suspense fallback={<div className='pt-28 px-6 text-gray-300'>Loading...</div>}>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Bookings' element={<Bookings />} />
        <Route path='/Events' element={<Events />} />
        <Route path='/Events/:id' element={<EventDetails />} />
        <Route path='/Venues' element={<Venues />} />
        <Route path='/News' element={<News />} />
        <Route path='/MyBookings' element={<MyBookings />} />
        <Route path='/pricing-info' element={<PricingInfo />} />
        <Route path='/order/:id' element={<OrderSummary />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/competitor-analysis" element={<CompetitorAnalysis />} />
        {/* Admin */}
        <Route path='/admin' element={<PricingDashboard />} />
        <Route path='/admin/pricing' element={<PricingDashboard />} />
        <Route path='/admin/simulator' element={<PriceSimulator />} />
        <Route path='/admin/forecast' element={<DemandForecast />} />
        <Route path='/admin/segments' element={<CustomerSegments />} />
        <Route path='/admin/analytics' element={<RevenueAnalytics />} />
        <Route path='/admin/rules' element={<PricingRules />} />
        <Route path='/admin/competitor-analysis' element={<AdminCompetitorAnalysis />} />
        {/* Organiser */}
        <Route path='/organiser' element={<OrganiserDashboard />} />
        <Route path='/organiser/events' element={<OrganiserEvents />} />
        <Route path='/organiser/events/new' element={<OrganiserCreateEvent />} />
        <Route path='/organiser/bookings' element={<OrganiserBookings />} />
      </Routes>
      </Suspense>
      {!isAdminRoute && !isOrganiserRoute && <Footer />}
    </>
  )
}

export default App
