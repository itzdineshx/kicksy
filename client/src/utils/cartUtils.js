// utils/cartUtils.js

export const getDefaultSeatType = (event) => {
  const types = Array.isArray(event?.seatTypes) ? event.seatTypes : [];
  const regular = types.find(t => (t.type || '').toLowerCase() === 'regular');
  const lowest = [...types].sort((a,b) => (a.price||0)-(b.price||0))[0];
  return regular?.type || lowest?.type || 'Regular';
};
