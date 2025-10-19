import { useState, useEffect } from 'react';

const OfferBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [settings, setSettings] = useState({
    text: '🎉 Diwali Special Offer: Get 25% OFF on all pickle varieties! ✨ Free shipping on orders above ₹500 🚀 Use code: DIWALI25 ⏰ Limited time offer - Ends Oct 31st!',
    isActive: true,
    backgroundColor: 'from-green-600 to-emerald-600',
    customStartColor: '#16a34a',
    customEndColor: '#059669',
    useCustomColors: false,
    textColor: 'text-white',
    animationSpeed: 30
  });

  useEffect(() => {
    // Load settings from localStorage
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('offerBannerSettings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Error loading offer settings:', error);
      }
    };

    // Load initial settings
    loadSettings();

    // Listen for updates from admin panel
    const handleOfferUpdate = (event) => {
      setSettings(event.detail);
    };

    window.addEventListener('offerBannerUpdate', handleOfferUpdate);

    return () => {
      window.removeEventListener('offerBannerUpdate', handleOfferUpdate);
    };
  }, []);

  if (!isVisible || !settings.isActive) return null;

  return (
    <div 
      className={`${settings.useCustomColors ? '' : `bg-gradient-to-r ${settings.backgroundColor}`} ${settings.textColor} py-3 px-4 relative overflow-hidden`}
      style={settings.useCustomColors ? {
        background: `linear-gradient(to right, ${settings.customStartColor}, ${settings.customEndColor})`
      } : {}}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Scrolling offer text */}
        <div className="flex-1 overflow-hidden">
          <div 
            className="animate-marquee whitespace-nowrap"
            style={{ animationDuration: `${settings.animationSpeed}s` }}
          >
            <span className="text-sm md:text-base font-medium">
              {settings.text}
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