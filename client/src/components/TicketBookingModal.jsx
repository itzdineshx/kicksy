import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

const seatZones = {
  VIP: ['A1','A2','A3','A4','A5','A6','A7','A8'],
  Regular: ['B1','B2','B3','B4','B5','B6','B7','B8','C1','C2','C3','C4','C5','C6','C7','C8'],
  Economy: ['D1','D2','D3','D4','D5','D6','D7','D8','E1','E2','E3','E4','E5','E6','E7','E8'],
};

const TicketBookingModal = ({ event, onClose, onConfirm }) => {
  const [step, setStep] = useState(1);
  const [show, setShow] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    seatType: '',
    selectedSeats: [],
    extras: [],
    fullName: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    setTimeout(() => setShow(true), 10);
  }, []);

  const seatOptions = event.seatTypes || [];
  const extrasOptions = event.extras || [];

  const totalPrice = () => {
    const seat = seatOptions.find(s => s.type === formData.seatType);
    const extras = formData.extras.reduce((sum, label) => {
      const extra = extrasOptions.find(e => e.label === label);
      return sum + (extra?.price || 0);
    }, 0);
    return (seat?.price || 0) * formData.selectedSeats.length + extras;
  };

  const toggleSeat = (seat) => {
    setFormData(prev => ({
      ...prev,
      selectedSeats: prev.selectedSeats.includes(seat)
        ? prev.selectedSeats.filter(s => s !== seat)
        : [...prev.selectedSeats, seat]
    }));
  };

  const handleBack = () => setStep(prev => prev - 1);

  const handleContinue = () => {
    if (step === 1) {
      if (!formData.seatType) return alert("Please select a seat type.");
      if (formData.selectedSeats.length === 0) return alert("Please select at least one seat.");
    }
    if (step === 3) {
      if (!formData.fullName || !formData.email || !formData.phone) {
        return alert("Please fill in all guest details.");
      }
    }
    setStep(prev => prev + 1);
  };

  const [showTick, setShowTick] = useState(false);

  const handleConfirm = () => {
    if (typeof onConfirm === 'function') {
      onConfirm(event, formData);
    }
    setIsConfirmed(true);
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });

    // Delay tick to allow fadeIn to finish first
    setTimeout(() => setShowTick(true), 200);

    setTimeout(() => {
      onClose();
      navigate('/Bookings');
    }, 3000);
  };


  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${show ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/0'}`}>
      <div className={`bg-[#111]/80 backdrop-blur-lg text-white rounded-xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh] shadow-2xl border border-gray-800 transition-all duration-300 transform ${show ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10'}`}>
        
        <X className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-white transition" onClick={onClose} />

        <h2 className="text-xl font-bold mb-4">🎟 {event.title} - Booking</h2>

        {/* Progress bar */}
        {!isConfirmed && (
          <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}>
            </div>
          </div>
        )}

        {isConfirmed ? (
        <div className="flex flex-col items-center justify-center text-center py-10 animate-fadeIn">
          <div className="bg-green-600 rounded-full p-4 mb-4 tick-wrapper">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M5 13l4 4L19 7"
                className="tick-animation"
              />
            </svg>
          </div>

          <h3 className="text-lg font-bold mb-2">Booking Confirmed!</h3>
          <p className="text-sm text-gray-400">
            Ticket details sent to <strong>{formData.email}</strong>
          </p>
        </div>
      ) : (

          <>
            {/* Step indicator */}
            <p className="text-sm text-gray-400 mb-4">Step {step} of 4</p>

            {step === 1 && (
              <>
                <h3 className="text-lg font-semibold mb-2">Select Seat Type</h3>
                <div className="space-y-3 mb-4">
                  {seatOptions.map((seat, idx) => (
                    <label key={idx} className="flex justify-between items-center border border-gray-700 p-3 rounded-lg cursor-pointer hover:border-blue-500 transition">
                      <input
                        type="radio"
                        name="seat"
                        value={seat.type}
                        checked={formData.seatType === seat.type}
                        onChange={(e) => setFormData({ ...formData, seatType: e.target.value, selectedSeats: [] })}
                      />
                      <div>
                        <p className="font-medium">{seat.type} - ₹{seat.price}</p>
                        <p className="text-xs text-gray-400">{seat.perks.join(', ')}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {formData.seatType && (
                  <>
                    <h4 className="font-semibold mb-2">Select Seats</h4>
                    {Object.entries(seatZones).map(([zone, seats]) => (
                      <div key={zone} className="mb-4">
                        <h5 className="text-sm text-gray-400 mb-2">{zone} Zone</h5>
                        <div className="grid grid-cols-8 gap-2">
                          {seats.map(seat => {
                            const isSelected = formData.selectedSeats.includes(seat);
                            const isActiveZone = zone === formData.seatType;

                            return (
                              <div
                                key={seat}
                                onClick={() => isActiveZone && toggleSeat(seat)}
                                className={`text-sm text-center py-2 rounded-lg border transition-all duration-200
                                  ${isSelected ? 'bg-green-500 border-green-400 animate-pulse' : isActiveZone ? 'bg-gray-700 hover:bg-green-600 cursor-pointer' : 'bg-gray-900 opacity-30 cursor-not-allowed'}`}
                              >
                                {seat}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}

            {step === 2 && (
              <>
                <h3 className="text-lg font-semibold mb-4">Add Extras</h3>
                <div className="grid grid-cols-1 gap-3">
                  {extrasOptions.map((extra, idx) => (
                    <label key={idx} className="flex justify-between items-center border border-gray-700 p-3 rounded-lg cursor-pointer hover:border-blue-500 transition">
                      <input
                        type="checkbox"
                        value={extra.label}
                        checked={formData.extras.includes(extra.label)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...formData.extras, extra.label]
                            : formData.extras.filter(label => label !== extra.label);
                          setFormData({ ...formData, extras: updated });
                        }}
                      />
                      <p>{extra.label} - ₹{extra.price}</p>
                    </label>
                  ))}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h3 className="text-lg font-semibold mb-4">Guest Details</h3>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  className="w-full p-2 mb-2 rounded bg-gray-800"
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  className="w-full p-2 mb-2 rounded bg-gray-800"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  className="w-full p-2 rounded bg-gray-800"
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </>
            )}

            {step === 4 && (
              <>
                <h3 className="text-lg font-semibold mb-2">Review & Confirm</h3>
                <ul className="text-sm space-y-1">
                  <li>Seat Type: <strong>{formData.seatType}</strong></li>
                  <li>Selected Seats: {formData.selectedSeats.join(', ')}</li>
                  <li>Extras: {formData.extras.length > 0 ? formData.extras.join(', ') : 'None'}</li>
                  <li>Name: {formData.fullName}</li>
                  <li>Email: {formData.email}</li>
                  <li>Phone: {formData.phone}</li>
                  <li className="mt-2 text-lg font-semibold">Total: ₹{totalPrice()}</li>
                </ul>
              </>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button onClick={handleBack} className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700">
                  Back
                </button>
              )}
              {step < 4 ? (
                <button onClick={handleContinue} className="bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded hover:opacity-90">
                  Continue
                </button>
              ) : (
                <button onClick={handleConfirm} className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded hover:opacity-90">
                  Confirm Booking
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TicketBookingModal;
