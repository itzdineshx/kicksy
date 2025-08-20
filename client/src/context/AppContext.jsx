// context/AppContext.js

import React, { createContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { getDefaultSeatType } from '../utils/cartUtils';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cartItems')) || [] } catch { return [] }
  });
  const [bookedEvents, setBookedEvents] = useState(() => {
    try { return JSON.parse(localStorage.getItem('bookedEvents')) || [] } catch { return [] }
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }, [cartItems])
  useEffect(() => {
    localStorage.setItem('bookedEvents', JSON.stringify(bookedEvents))
  }, [bookedEvents])

  const toggleCart = (item) => {
    const exists = cartItems.some(i => i._id === item._id);
    if (exists) {
      setCartItems(cartItems.filter(i => i._id !== item._id));
    } else {
      const seatType = getDefaultSeatType(item);
      setCartItems([...cartItems, { ...item, quantity: 1, seatType }]);
    }
  };

  const updateCartItem = (id, updates) => {
    setCartItems(prev => prev.map(i => i._id === id ? { ...i, ...updates } : i));
  };

  const removeCartItem = (id) => {
    setCartItems(prev => prev.filter(i => i._id !== id));
  };

  const clearCart = () => setCartItems([]);

  const addBooking = async (event, userId, formData = {}) => {
    const bookingId = `${event._id}-${Date.now()}`
    const booking = {
      bookingId,
      event,
      userId: userId || null,
      seatType: formData.seatType || null,
      extras: formData.extras || [],
      fullName: formData.fullName || null,
      email: formData.email || null,
      phone: formData.phone || null,
      createdAt: new Date().toISOString(),
      isPaid: false,
    }
    const next = [...bookedEvents, booking]
    setBookedEvents(next)
    if (isSupabaseConfigured() && userId) {
      try {
        await supabase.from('bookings').insert({
          user_id: userId,
          event_id: event._id,
          event_title: event.title,
          event_date: event.date,
          event_time: event.time,
          location: event.location,
          payload: booking,
          is_paid: false,
        })
      } catch {
        // ignore network/insert errors for now
      }
    }
    return bookingId
  };

  const getCartItemUnitPrice = (item) => {
    const types = Array.isArray(item?.seatTypes) ? item.seatTypes : [];
    const seat = types.find(t => (t.type || '').toLowerCase() === (item.seatType || '').toLowerCase());
    if (seat?.price) return seat.price;
    const regular = types.find(t => (t.type || '').toLowerCase() === 'regular');
    return regular?.price || types[0]?.price || 0;
  };

  const cartTotals = () => {
    const subtotal = cartItems.reduce((sum, it) => sum + getCartItemUnitPrice(it) * (it.quantity || 1), 0);
    const fees = cartItems.length ? 49 : 0;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax + fees;
    return { subtotal, tax, fees, total };
  };

  return (
    <AppContext.Provider
      value={{
        cartItems,
        bookedEvents,
        toggleCart,
        updateCartItem,
        removeCartItem,
        clearCart,
        addBooking,
        getCartItemUnitPrice,
        cartTotals,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext };
