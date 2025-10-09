import { useState } from 'react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useAPI';
import api from '../services/api';

const AdminPanel = ({ onBackToHome }) => {
  // API hooks
  const { products, loading, error, refetch } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  // Component state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Vegetarian',
    spiceLevel: 'Medium',
    region: 'South Indian',
    image: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image upload
  const handleImageUpload = async (file) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formDataObj = new FormData();
      formDataObj.append('image', file);

      const response = await api.uploadImage(formDataObj);
      const imageUrl = response.data.imageUrl;
      
      setFormData(prev => ({ ...prev, image: imageUrl }));
      setImagePreview(imageUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  // Save product (create or update)
  const handleSaveProduct = async () => {
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (editingProduct) {
        await updateProduct.mutate({ id: editingProduct.id, productData });
      } else {
        await createProduct.mutate(productData);
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Vegetarian',
        spiceLevel: 'Medium',
        region: 'South Indian',
        image: ''
      });
      setImagePreview(null);
      setShowAddForm(false);
      setEditingProduct(null);
      
      // Refresh products
      refetch();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  // Edit product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      spiceLevel: product.spiceLevel,
      region: product.region,
      image: product.image
    });
    setImagePreview(product.image);
    setShowAddForm(true);
  };

  // Delete product
  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct.mutate(productId);
        refetch();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setShowAddForm(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Vegetarian',
      spiceLevel: 'Medium',
      region: 'South Indian',
      image: ''
    });
    setImagePreview(null);
  };

  // Filter products by category
  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const categories = ['All', 'Vegetarian', 'Non-Vegetarian', 'Seafood', "Podi's"];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ecab13] mx-auto mb-4"></div>
          <p className="text-[#221c10] text-lg">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f7f6] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Error loading products: {error}</p>
          <button 
            onClick={() => refetch()} 
            className="px-4 py-2 bg-[#ecab13] text-white rounded hover:bg-[#d49c12] transition-colors mr-4"
          >
            Retry
          </button>
          <button 
            onClick={onBackToHome} 
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f6] font-sans text-[#221c10]">
      {/* Header */}
      <header className="sticky top-0 z-20 w-full border-b border-[#ecab13]/20 bg-[#f8f7f6]/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 sm:px-8 py-4">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/logo.png"
              alt="Janiitra Logo"
              className="h-8 w-48 sm:h-12 sm:w-60 object-contain"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-[#ecab13] text-white rounded-lg hover:bg-[#d49c12] transition-colors"
            >
              Add Product
            </button>
            <button
              onClick={onBackToHome}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#221c10] mb-8">Admin Panel</h1>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#ecab13] text-white'
                    : 'bg-white text-[#221c10] border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={product.image || '/assets/logo.png'}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                <p className="text-[#ecab13] font-bold text-lg mb-2">${product.price}</p>
                <div className="flex flex-wrap gap-1 text-xs mb-3">
                  <span className="bg-gray-100 px-2 py-1 rounded">{product.category}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">{product.spiceLevel}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded">{product.region}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Product Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                
                {/* Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                    >
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                      <option value="Seafood">Seafood</option>
                      <option value="Podi's">Podi's</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Spice Level</label>
                    <select
                      name="spiceLevel"
                      value={formData.spiceLevel}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                    >
                      <option value="Mild">Mild</option>
                      <option value="Medium">Medium</option>
                      <option value="Hot">Hot</option>
                      <option value="Extra Hot">Extra Hot</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Region</label>
                    <select
                      name="region"
                      value={formData.region}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                    >
                      <option value="South Indian">South Indian</option>
                      <option value="North Indian">North Indian</option>
                      <option value="Gujarati">Gujarati</option>
                      <option value="Hyderabadi">Hyderabadi</option>
                      <option value="Coastal">Coastal</option>
                    </select>
                  </div>
                  
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Image</label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                        isDragOver ? 'border-[#ecab13] bg-[#ecab13]/10' : 'border-gray-300'
                      }`}
                      onDrop={handleDrop}
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={() => setIsDragOver(false)}
                    >
                      {imagePreview ? (
                        <div className="space-y-2">
                          <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover mx-auto rounded" />
                          <button
                            type="button"
                            onClick={() => { setImagePreview(null); setFormData(prev => ({ ...prev, image: '' })); }}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Remove Image
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-600 mb-2">
                            {isUploading ? 'Uploading...' : 'Drag & drop an image here, or click to select'}
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileInputChange}
                            className="hidden"
                            id="imageInput"
                            disabled={isUploading}
                          />
                          <label
                            htmlFor="imageInput"
                            className="inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded cursor-pointer hover:bg-gray-300 transition-colors"
                          >
                            Choose File
                          </label>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Form Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSaveProduct}
                    disabled={isUploading || !formData.name || !formData.description || !formData.price}
                    className="flex-1 px-4 py-2 bg-[#ecab13] text-white rounded-lg hover:bg-[#d49c12] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;