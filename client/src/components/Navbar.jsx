import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Ticket, ShoppingCart } from 'lucide-react';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { useApp } from '../hooks/useApp';
import { newsData, dummyShowsData } from '../data/assests';
import NotificationBell from './NotificationBell';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartItems } = useApp();

  const { user } = useUser();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setShowCart(false);
        setShowSearch(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const isDrawerOpen = showCart || showSearch;
  const navLinks = ['Home', 'Events', 'Venues', 'News'];

  return (
    <>
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity"
          onClick={() => {
            setShowCart(false);
            setShowSearch(false);
          }}
        />
      )}

      <div className="fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-36 py-5 bg-black/70 backdrop-blur-sm">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => {
            setIsOpen(false);
            window.scrollTo(0, 0);
          }}
        >
          <img src="/logo.png" alt="Kicksy Logo" className="w-36 h-auto" />
        </Link>

        {/* Nav Links */}
        <div className="max-md:overflow-hidden">
          <div
            className={`
              max-md:fixed max-md:inset-0 max-md:bg-black max-md:flex max-md:flex-col max-md:justify-center max-md:items-center
              max-md:z-40 max-md:transition-transform max-md:duration-300
              md:flex md:flex-row md:gap-8 md:bg-transparent md:static
              ${isOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'}
            `}
          >
            {navLinks.map((name) => (
              <Link
                key={name}
                className="relative text-white text-2xl md:text-base py-3 px-4 hover:text-[var(--color-primary)] transition 
                           before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0 
                           before:bg-[var(--color-primary)] before:transition-all before:duration-300 
                           hover:before:w-full"
                to={name === 'Home' ? '/' : `/${name}`}
                onClick={() => {
                  setIsOpen(false);
                  window.scrollTo(0, 0);
                }}
              >
                {name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <NotificationBell />

          {/* Cart */}
          <div className="relative">
            <ShoppingCart className="w-6 h-6 cursor-pointer" onClick={() => setShowCart(true)} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-red-600 text-white rounded-full px-1.5">
                {cartItems.length}
              </span>
            )}
          </div>

          {/* Search */}
          <Search className="w-6 h-6 cursor-pointer" onClick={() => setShowSearch(true)} />

          {/* Login/User */}
          {!user ? (
            <button
              onClick={openSignIn}
              className="px-5 py-1 sm:px-7 sm:py-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dull)] transition rounded-full font-medium"
            >
              Login
            </button>
          ) : (
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="My Bookings"
                  labelIcon={<Ticket width={14} />}
                  onClick={() => navigate('/Bookings')}
                />
              </UserButton.MenuItems>
            </UserButton>
          )}
        </div>

        {/* Hamburger */}
        <Menu className="md:hidden w-8 h-8 cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
      </div>
      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black text-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close Icon */}
        <X
          className="absolute top-6 right-6 w-8 h-8 cursor-pointer"
          onClick={() => setIsOpen(false)}
        />

        {/* Links with stagger animation */}
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {['Home', 'Events', 'Venues', 'News'].map((name, idx) => (
            <Link
              key={name}
              to={`/${name === 'Home' ? '' : name}`}
              className={`text-xl transition-all duration-500 transform ${
                isOpen
                  ? `opacity-100 translate-y-0 delay-[${idx * 100}ms]`
                  : 'opacity-0 translate-y-5'
              }`}
              onClick={() => {
                setIsOpen(false);
                window.scrollTo(0, 0);
              }}
            >
              {name}
            </Link>
          ))}
        </div>
      </div>

      {/* Cart Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-80 md:w-96 bg-white text-black shadow-lg z-50 transition-transform duration-300 flex flex-col ${
          showCart ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center px-4 sm:px-5 py-4 border-b bg-white">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <X className="w-5 h-5 cursor-pointer" onClick={() => setShowCart(false)} />
        </div>

        <div className="flex-1 overflow-y-auto p-4 text-sm space-y-3">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingCart className="w-12 h-12 mb-4 opacity-50" />
              <p>No items in cart.</p>
            </div>
          ) : (
            cartItems.map((item) => <CartRow key={item._id} item={item} />)
          )}
        </div>

        <div className="border-t bg-white">
          <CartSummary onClose={() => setShowCart(false)} />
        </div>
      </div>

      {/* Search Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white text-black shadow-lg z-50 transition-transform duration-300 ${
          showSearch ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center px-4 sm:px-5 py-4 border-b">
          <h2 className="text-lg font-semibold">Search</h2>
          <X className="w-5 h-5 cursor-pointer" onClick={() => setShowSearch(false)} />
        </div>

        <div className="p-4 space-y-4 overflow-y-auto h-[90%]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, news..."
            className="w-full border px-4 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {searchQuery && (
            <>
              <div>
                <h3 className="font-semibold text-sm text-gray-700 mt-3 mb-2">🎟️ Events</h3>
                {dummyShowsData
                  .filter((event) => event.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((event) => (
                    <div
                      key={event._id}
                      onClick={() => {
                        navigate(`/Events/${event._id}`);
                        setShowSearch(false);
                        setSearchQuery('');
                      }}
                      className="cursor-pointer mb-4 border p-2 rounded hover:shadow-md transition"
                    >
                      <img src={event.backdrop_path} alt={event.title} className="w-full h-24 object-cover rounded mb-1" />
                      <p className="font-semibold text-blue-700 text-sm">{event.title}</p>
                      <p className="text-xs text-gray-600">{event.date} • {event.time}</p>
                      <p className="text-xs text-gray-500">{event.location}</p>
                    </div>
                  ))}
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-700 mt-5 mb-2">📰 News</h3>
                {newsData
                  .filter((news) => news.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((news, i) => (
                    <div key={i} className="mb-4 border p-2 rounded hover:shadow-md transition">
                      <a href={news.link} target="_blank" rel="noopener noreferrer">
                        <img src={news.image} alt={news.title} className="w-full h-24 object-cover rounded mb-1" />
                        <p className="font-semibold text-blue-700 text-sm">{news.title}</p>
                      </a>
                      <p className="text-xs text-gray-500">{news.date}</p>
                      <p className="text-xs text-gray-600 line-clamp-2">{news.summary?.slice(0, 60)}...</p>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

const CartRow = ({ item }) => {
  const { updateCartItem, removeCartItem, getCartItemUnitPrice } = useApp();
  const unit = getCartItemUnitPrice(item);
  const seatTypes = Array.isArray(item.seatTypes) ? item.seatTypes : [];
  return (
    <div className="flex items-start gap-3 border rounded p-2">
      <img src={item.backdrop_path} alt={item.title} className="w-16 h-16 rounded object-cover" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{item.title}</p>
        <p className="text-gray-600 text-xs">{item.date} • {item.time}</p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
          <select
            value={item.seatType || ''}
            onChange={(e) => updateCartItem(item._id, { seatType: e.target.value })}
            className="border rounded px-2 py-1 text-xs w-full sm:w-auto"
          >
            {seatTypes.map((s) => (
              <option key={s.type} value={s.type}>
                {s.type} — ₹{s.price}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateCartItem(item._id, { quantity: Math.max(1, (item.quantity || 1) - 1) })}
              className="px-2 py-1 border rounded"
            >
              -
            </button>
            <span>{item.quantity || 1}</span>
            <button
              onClick={() => updateCartItem(item._id, { quantity: (item.quantity || 1) + 1 })}
              className="px-2 py-1 border rounded"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-600">Unit: ₹{unit.toLocaleString()}</span>
          <span className="font-semibold">₹{(unit * (item.quantity || 1)).toLocaleString()}</span>
        </div>
      </div>
      <button onClick={() => removeCartItem(item._id)} className="text-xs text-red-600">Remove</button>
    </div>
  );
};

const CartSummary = ({ onClose }) => {
  const { cartItems, cartTotals, clearCart } = useApp();
  const { subtotal, tax, fees, total } = cartTotals();
  const navigate = useNavigate();

  if (cartItems.length === 0) return null;

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      const firstItem = cartItems[0];
      onClose?.();
      navigate(`/Events/${firstItem._id}`);
    }
  };

  return (
    <div className="p-4 space-y-3 bg-gray-50 border-t">
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax (5%)</span>
          <span>₹{tax.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Fees</span>
          <span>₹{fees.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-semibold text-lg border-t pt-3">
          <span>Total</span>
          <span className="text-blue-600">₹{total.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex gap-3 pt-3">
        <button
          onClick={clearCart}
          className="flex-1 border-2 border-gray-300 rounded-lg py-3 px-4 font-medium text-gray-700 hover:bg-gray-100"
        >
          Clear Cart
        </button>
        <button
          onClick={handleCheckout}
          disabled={!cartItems.length}
          className="flex-1 bg-[var(--color-primary)] text-white rounded-lg py-3 px-4 font-medium hover:bg-[var(--color-primary-dull)] disabled:opacity-50"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default NavBar;
