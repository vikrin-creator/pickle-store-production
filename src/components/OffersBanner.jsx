import { useState, useEffect } from 'react';
import offersService from '../services/offersService';

const OffersBanner = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);

  useEffect(() => {
    fetchActiveOffers();
  }, []);

  useEffect(() => {
    // Auto-rotate offers if there are multiple
    if (offers.length > 1) {
      const interval = setInterval(() => {
        setCurrentOfferIndex((prevIndex) => 
          prevIndex === offers.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); // Change offer every 5 seconds

      return () => clearInterval(interval);
    }
  }, [offers.length]);

  const fetchActiveOffers = async () => {
    try {
      setLoading(true);
      const activeOffers = await offersService.getActiveOffers();
      setOffers(activeOffers);
      setError(null);
    } catch (error) {
      console.error('Error fetching active offers:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null; // Don't show anything while loading
  }

  if (error || offers.length === 0) {
    return null; // Don't show banner if there's an error or no offers
  }

  const currentOffer = offers[currentOfferIndex];

  return (
    <div 
      className="w-full overflow-hidden relative"
      style={{ 
        backgroundColor: currentOffer.backgroundColor || '#FF6B35',
        color: currentOffer.textColor || '#FFFFFF'
      }}
    >
      {/* Main scrolling text container */}
      <div className="relative flex items-center py-2 px-4">
        {/* Running text animation */}
        <div className="flex items-center whitespace-nowrap animate-marquee">
          <span className="text-sm md:text-base font-medium px-8">
            {currentOffer.text}
          </span>
          {/* Repeat the text for seamless loop */}
          <span className="text-sm md:text-base font-medium px-8">
            {currentOffer.text}
          </span>
          <span className="text-sm md:text-base font-medium px-8">
            {currentOffer.text}
          </span>
        </div>

        {/* Offer indicators (if multiple offers) */}
        {offers.length > 1 && (
          <div className="absolute right-4 flex items-center gap-1">
            {offers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentOfferIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentOfferIndex 
                    ? 'bg-white scale-125' 
                    : 'bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Show offer ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Close button (optional) */}
        <button 
          onClick={() => setOffers([])}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/75 hover:text-white p-1 rounded-full hover:bg-white/20 transition-all duration-200 ml-auto"
          aria-label="Close offer banner"
          title="Close banner"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Gradient edges for visual effect */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-current to-transparent opacity-30 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-current to-transparent opacity-30 pointer-events-none"></div>
    </div>
  );
};

export default OffersBanner;