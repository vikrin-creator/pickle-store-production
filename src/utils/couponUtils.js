// Utility functions for parsing coupon information from offer banner text

/**
 * Parses offer banner text to extract coupon information
 * @param {string} bannerText - The offer banner text
 * @returns {object|null} - Parsed coupon object or null if no valid coupon found
 */
export const parseCouponFromBanner = (bannerText) => {
  if (!bannerText || typeof bannerText !== 'string') {
    return null;
  }

  // Patterns to match coupon codes and discounts
  const couponCodePatterns = [
    /(?:code:?\s*|use\s+code:?\s*)([A-Z0-9]+)/i,
    /(?:coupon:?\s*|apply:?\s*)([A-Z0-9]+)/i,
    /(?:promo:?\s*|promocode:?\s*)([A-Z0-9]+)/i
  ];

  const discountPatterns = [
    /(\d+)%\s*(?:off|discount)/i,
    /get\s*(\d+)%/i,
    /save\s*(\d+)%/i,
    /(\d+)\s*percent/i
  ];

  // Extract coupon code
  let couponCode = null;
  for (const pattern of couponCodePatterns) {
    const match = bannerText.match(pattern);
    if (match && match[1]) {
      couponCode = match[1].toUpperCase();
      break;
    }
  }

  // Extract discount percentage
  let discountPercent = null;
  for (const pattern of discountPatterns) {
    const match = bannerText.match(pattern);
    if (match && match[1]) {
      discountPercent = parseInt(match[1], 10);
      break;
    }
  }

  // Only return coupon if both code and discount are found
  if (couponCode && discountPercent && discountPercent > 0 && discountPercent <= 100) {
    return {
      code: couponCode,
      discount: discountPercent,
      description: `${discountPercent}% OFF`,
      minAmount: getMinAmountFromText(bannerText),
      source: 'banner',
      isActive: true
    };
  }

  return null;
};

/**
 * Extracts minimum amount from banner text
 * @param {string} bannerText - The offer banner text
 * @returns {number} - Minimum amount or default 300
 */
const getMinAmountFromText = (bannerText) => {
  // Look for minimum amount patterns
  const minAmountPatterns = [
    /min(?:imum)?\s*(?:order|purchase|amount)?:?\s*₹?(\d+)/i,
    /above\s*₹(\d+)/i,
    /over\s*₹(\d+)/i,
    /₹(\d+)\s*(?:and\s*above|or\s*more)/i
  ];

  for (const pattern of minAmountPatterns) {
    const match = bannerText.match(pattern);
    if (match && match[1]) {
      const amount = parseInt(match[1], 10);
      if (amount >= 100 && amount <= 10000) { // Reasonable range
        return amount;
      }
    }
  }

  // Default minimum amount
  return 300;
};

/**
 * Gets the current offer banner settings from localStorage
 * @returns {object|null} - Banner settings or null
 */
export const getOfferBannerSettings = () => {
  try {
    const savedSettings = localStorage.getItem('offerBannerSettings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
  } catch (error) {
    console.error('Error loading offer banner settings:', error);
  }
  return null;
};

/**
 * Gets the current dynamic coupon from offer banner
 * @returns {object|null} - Dynamic coupon object or null
 */
export const getDynamicCoupon = () => {
  const bannerSettings = getOfferBannerSettings();
  
  if (!bannerSettings || !bannerSettings.isActive || !bannerSettings.text) {
    return null;
  }

  return parseCouponFromBanner(bannerSettings.text);
};

/**
 * Validates if a coupon code matches the current banner coupon
 * @param {string} inputCode - The coupon code entered by user
 * @returns {object|null} - Coupon object if valid, null if invalid
 */
export const validateDynamicCoupon = (inputCode) => {
  const dynamicCoupon = getDynamicCoupon();
  
  if (!dynamicCoupon || !inputCode) {
    return null;
  }

  if (inputCode.toUpperCase() === dynamicCoupon.code) {
    return dynamicCoupon;
  }

  return null;
};

/**
 * Gets example coupon text for display in UI
 * @returns {string} - Example coupon text
 */
export const getExampleCouponText = () => {
  const dynamicCoupon = getDynamicCoupon();
  
  if (dynamicCoupon) {
    return `Current offer: ${dynamicCoupon.code} - ${dynamicCoupon.discount}% OFF (Min ₹${dynamicCoupon.minAmount})`;
  }
  
  return "No active coupon available";
};