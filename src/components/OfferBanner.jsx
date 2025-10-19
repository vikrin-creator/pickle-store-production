import { useState } from 'react';

const OfferBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4 relative overflow-hidden">
      <div className="container mx-auto flex items-center justify-between">
        {/* Scrolling offer text */}
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            <span className="text-sm md:text-base font-medium">
              🎉 Diwali Special Offer: Get 25% OFF on all pickle varieties! 
              ✨ Free shipping on orders above ₹500 
              🚀 Use code: DIWALI25 
              ⏰ Limited time offer - Ends Oct 31st!
            </span>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors text-white font-bold text-lg"
          aria-label="Close offer banner"
        >
          ×
        </button>
      </div>

      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-repeat-x" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
             }}>
        </div>
      </div>
    </div>
  );
};

export default OfferBanner;