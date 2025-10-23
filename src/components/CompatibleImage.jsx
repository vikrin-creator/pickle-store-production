import { useState, useEffect } from 'react';

const CompatibleImage = ({ src, alt, className = '', fallbackSrc = null, ...props }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(src);

  // Safari-specific Cloudinary image handling
  useEffect(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    let processedSrc = src;

    // Fix Cloudinary URLs for Safari compatibility
    if (src.includes('res.cloudinary.com')) {
      // Ensure HTTPS for Cloudinary
      processedSrc = src.replace(/^http:/, 'https:');
      
      // Add Safari-friendly parameters for Cloudinary
      if (!processedSrc.includes('f_auto')) {
        // Add format auto-detection, but prefer JPG for Safari
        const urlParts = processedSrc.split('/upload/');
        if (urlParts.length === 2) {
          processedSrc = `${urlParts[0]}/upload/f_jpg,q_auto/${urlParts[1]}`;
        }
      }
    }

    // Fix API URLs for Safari
    if (src.startsWith('/api/')) {
      processedSrc = `https://pickle-store-backend.onrender.com${src}`;
    }

    // Ensure HTTPS for all external URLs
    if (src.startsWith('http://')) {
      processedSrc = src.replace('http://', 'https://');
    }

    setImgSrc(processedSrc);
  }, [src]);

  const handleError = () => {
    console.warn(`Cloudinary image failed to load: ${imgSrc}`);
    
    // Try Safari-specific fallback strategies
    if (!hasError && imgSrc.includes('res.cloudinary.com')) {
      // Remove format transformations and try plain URL
      const baseUrl = imgSrc.split('/upload/')[0];
      const imagePath = imgSrc.split('/upload/')[1];
      
      if (imagePath && imagePath.includes('f_jpg,q_auto/')) {
        const plainImagePath = imagePath.replace('f_jpg,q_auto/', '');
        const safariUrl = `${baseUrl}/upload/${plainImagePath}`;
        console.log(`Trying Safari fallback: ${safariUrl}`);
        setImgSrc(safariUrl);
        return;
      }
    }
    
    // If we have a fallback, use it
    if (fallbackSrc && !hasError) {
      console.log(`Using fallback image: ${fallbackSrc}`);
      setImgSrc(fallbackSrc);
      setHasError(true);
      return;
    }
    
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    console.log(`Image loaded successfully: ${imgSrc}`);
  };

  // If there's an error and no fallback, show placeholder
  if (hasError && !fallbackSrc) {
    return (
      <div 
        className={`image-fallback bg-gray-100 flex items-center justify-center ${className}`} 
        style={{ minHeight: '100px' }}
        {...props}
      >
        <span className="text-gray-500 text-sm text-center p-2">
          🖼️ Image not available
        </span>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div 
          className={`image-fallback bg-gray-100 flex items-center justify-center absolute inset-0 ${className}`}
        >
          <span className="text-gray-500 text-sm">Loading...</span>
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={`safari-compatible-image image-loading-transition ${className} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
        crossOrigin="anonymous"
        referrerPolicy="no-referrer-when-downgrade"
        {...props}
      />
    </div>
  );
};

export default CompatibleImage;