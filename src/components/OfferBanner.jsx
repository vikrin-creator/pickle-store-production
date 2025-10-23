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
            isActive: true
          });
        }
      } catch (error) {
        console.error('Error loading offer settings:', error);
        // Set minimal fallback if API fails
        setSettings({
          text: '🎉 Welcome to Janiitra Pickles! Fresh & Authentic! 🌶️',
          isActive: true
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4">
        <div className="container mx-auto text-center">
          <span className="text-sm">Loading offer...</span>
        </div>
      </div>
    );
  }

  if (!isVisible || !settings || !settings.isActive) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Simple static offer text */}
        <div className="flex-1">
          <span className="text-sm md:text-base font-medium">
            {settings.text || 'Welcome to our store!'}
          </span>
        </div>

        {/* Simple close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 text-white hover:text-gray-200 font-bold text-lg"
          aria-label="Close offer banner"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default OfferBanner;