import React, { useState, useEffect } from 'react';

const ImageManager = () => {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('https://pickle-store-backend.onrender.com/api/images/list');
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('https://pickle-store-backend.onrender.com/api/images/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        alert('Image uploaded successfully!');
        setSelectedFile(null);
        fetchImages(); // Refresh the list
      } else {
        const error = await response.json();
        alert(`Upload failed: ${error.error}`);
      }
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filename) => {
    if (!confirm(`Are you sure you want to delete ${filename}?`)) return;

    try {
      const response = await fetch(`https://pickle-store-backend.onrender.com/api/images/delete/${filename}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Image deleted successfully!');
        fetchImages(); // Refresh the list
      } else {
        const error = await response.json();
        alert(`Delete failed: ${error.error}`);
      }
    } catch (error) {
      alert('Delete failed: ' + error.message);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Image Manager</h2>
      
      {/* Upload Section */}
      <div className="mb-8 p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Upload New Image</h3>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          />
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        {selectedFile && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
          </p>
        )}
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image) => (
          <div key={image.filename} className="border rounded-lg overflow-hidden shadow-sm">
            <div className="aspect-square overflow-hidden bg-gray-100">
              <img
                src={`https://pickle-store-backend.onrender.com${image.url}`}
                alt={image.filename}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/assets/logo.png'; // Fallback image
                }}
              />
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-gray-800 truncate" title={image.filename}>
                {image.filename}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatFileSize(image.length)}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(image.uploadDate).toLocaleDateString()}
              </p>
              <button
                onClick={() => handleDelete(image.filename)}
                className="mt-2 w-full px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No images found. Upload some images to get started!</p>
        </div>
      )}
    </div>
  );
};

export default ImageManager;