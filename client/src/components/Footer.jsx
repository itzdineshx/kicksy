import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 px-6 pt-12 md:px-16 lg:px-36 mt-40 w-full">
      <div className="flex flex-col md:flex-row justify-between gap-10 border-b border-gray-600 pb-14">
        
        <div className="md:max-w-lg">
          <div className="flex items-center gap-2 cursor-pointer">
            <img
              src="/logo.png"
              alt="Kicksy Logo"
              className="h-12 w-auto"
              onClick={()=> { window.scrollTo(0,0); }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/6/6f/Sports_icon.png'; 
              }}
            />

          </div>

          <p className="mt-6 text-sm leading-relaxed">
            Your ultimate sports ticket booking platform across India.
            Get access to live matches, tournaments, and more – cricket, kabaddi, football & more.
          </p>

          <div className="flex items-center gap-4 mt-6">
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
                className="h-10 w-auto bg-black rounded"
              />
            </a>
            <a
              href="https://www.apple.com/app-store/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="App Store"
                className="h-10 w-auto"
              />
            </a>
          </div>
        </div>

        <div className="flex-1 flex flex-wrap justify-start md:justify-end gap-10">
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="text-sm space-y-2">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/about" className="hover:text-white">About Us</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
              <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="text-sm space-y-2">
              <li>📞 +91 98765 43210</li>
              <li>✉️ kicksy@support.com</li>
            </ul>
          </div>
        </div>
      </div>

      <p className="pt-6 text-center text-xs text-gray-400 pb-6">
        © {new Date().getFullYear()} <a href="https://kicksy-v1.vercel.app" className="hover:underline hover:text-white">Kicksy</a>. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
