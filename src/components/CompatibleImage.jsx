import { useState } from 'react';

const CompatibleImage = ({ src, alt, className = '', fallbackSrc = null, ...props }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // If there's an error and no fallback, show placeholder
  if (hasError && !fallbackSrc) {
    return (
      <div className={`image-fallback ${className}`} {...props}>
        <span className="text-gray-500 text-sm">🖼️ Image not available</span>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className={`image-fallback ${className}`}>
          <span className="text-gray-500 text-sm">Loading...</span>
        </div>
      )}
      <img
        src={hasError && fallbackSrc ? fallbackSrc : src}
        alt={alt}
        className={`${className} ${isLoading ? 'hidden' : 'block'}`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
        {...props}
      />
    </>
  );
};

export default CompatibleImage;