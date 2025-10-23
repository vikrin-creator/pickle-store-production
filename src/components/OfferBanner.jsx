import { useState, useEffect } from 'react';
import OfferBannerService from '../services/offerBannerService';

const OfferBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load settings from database via API
    const loadSettings = async () => {
      try {
        setLoading(true);
        const data = await OfferBannerService.getOfferBannerSettings();
        if (data && typeof data === 'object') {
          setSettings(data);
        } else {
          // Use fallback if data is invalid
          setSettings({
            text: '🎉 Welcome to Janiitra Pickles! Fresh & Authentic! 🌶️',
            isActive: true,
            backgroundColor: 'from-green-500 to-green-600',
            textColor: 'text-white',
            useCustomColors: false,
            customStartColor: '#10b981',
            customEndColor: '#059669'
          });
        }
      } catch (error) {
        console.error('Error loading offer settings:', error);
        // Set minimal fallback if API fails
        setSettings({
          text: '🎉 Welcome to Janiitra Pickles! Fresh & Authentic! 🌶️',
          isActive: true,
          backgroundColor: 'from-green-500 to-green-600',
          textColor: 'text-white',
          useCustomColors: false,
          customStartColor: '#10b981',
          customEndColor: '#059669'
        });
      } finally {
        setLoading(false);
      }
    };

    // Load initial settings
    loadSettings();

    // Listen for updates from admin panel
    const handleOfferUpdate = (event) => {
      console.log('OfferBanner received update:', event.detail);
      if (event.detail && typeof event.detail === 'object') {
        setSettings(event.detail);
        // If banner was closed, make it visible again for new offer
        setIsVisible(true);
      }
    };

    window.addEventListener('offerBannerUpdate', handleOfferUpdate);

    return () => {
      window.removeEventListener('offerBannerUpdate', handleOfferUpdate);
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4">
        <div className="container mx-auto text-center">
          <span className="text-sm">🔄 Loading latest offers...</span>
        </div>
      </div>
    );
  }

  if (!isVisible || !settings || !settings.isActive) {
    return null;
  }

  return (
    <div 
      className={`${settings.useCustomColors ? '' : `bg-gradient-to-r ${settings.backgroundColor || 'from-green-500 to-green-600'}`} ${settings.textColor || 'text-white'} py-3 px-4`}
      style={settings.useCustomColors ? {
        background: `linear-gradient(to right, ${settings.customStartColor || '#10b981'}, ${settings.customEndColor || '#059669'})`
      } : {}}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Dynamic offer text */}
        <div className="flex-1">
          <span className="text-sm md:text-base font-medium">
            {settings.text || 'Welcome to our store!'}
          </span>
        </div>

        {/* Close button with dynamic colors */}
        <button
          onClick={() => setIsVisible(false)}
          className={`ml-4 ${settings.textColor || 'text-white'} hover:opacity-70 font-bold text-lg`}
          aria-label="Close offer banner"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default OfferBanner;