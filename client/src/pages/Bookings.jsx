// pages/Bookings.jsx

import React, { useEffect, useState } from 'react';
import { useApp } from '../hooks/useApp';
import EventCard from '../components/EventCard';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const Bookings = () => {
  const { bookedEvents } = useApp();
  const { user } = useUser();
  const [serverBookings, setServerBookings] = useState([])

  useEffect(() => {
    const fetchBookings = async () => {
      if (!isSupabaseConfigured() || !user) return
      const { data, error } = await supabase
        .from('bookings')
        .select('payload')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)
      if (!error && Array.isArray(data)) setServerBookings(data.map(row => row.payload).filter(Boolean))
    }
    fetchBookings()
    
    // Realtime subscription for user's bookings
    if (!isSupabaseConfigured() || !user) return
    const channel = supabase
      .channel('bookings_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookings', filter: `user_id=eq.${user.id}` }, (payload) => {
        const row = payload?.new
        if (row?.payload) {
          setServerBookings(prev => {
            const exists = prev.find(b => (b.bookingId && b.bookingId === row.payload.bookingId))
            return exists ? prev : [row.payload, ...prev]
          })
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'bookings', filter: `user_id=eq.${user.id}` }, (payload) => {
        const row = payload?.new
        if (row?.payload) {
          setServerBookings(prev => prev.map(b => (b.bookingId && b.bookingId === row.payload.bookingId) ? row.payload : b))
        }
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'bookings', filter: `user_id=eq.${user.id}` }, (payload) => {
        const row = payload?.old
        if (row?.payload) {
          setServerBookings(prev => prev.filter(b => !(b.bookingId && b.bookingId === row.payload.bookingId)))
        }
      })
      .subscribe()

    return () => {
      try { if (channel) supabase.removeChannel(channel) } catch {}
    }
  }, [user])

  const combined = React.useMemo(() => {
    const result = [...bookedEvents]
    if (Array.isArray(serverBookings) && serverBookings.length) {
      for (const b of serverBookings) {
        if (!result.find(x => x.bookingId ? x.bookingId === b.bookingId : x._id === b._id)) {
          result.push(b)
        }
      }
    }
    return result
  }, [bookedEvents, serverBookings])

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 pt-30  pb-32">
      <h1 className="text-2xl font-bold text-white mb-6">My Bookings</h1>
      <SignedOut>
        <div className="text-gray-300 space-y-3">
          <p>Please sign in to view your bookings.</p>
          <SignInButton>
            <button className="px-5 py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dull)] rounded-md text-white">Sign in</button>
          </SignInButton>
        </div>
      </SignedOut>
      <SignedIn>
        {combined.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {combined.map((entry) => (
              <EventCard key={entry.bookingId || entry._id} event={entry.event || entry} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">You haven’t booked any events yet.</p>
        )}
      </SignedIn>
    </div>
  );
};

export default Bookings;
