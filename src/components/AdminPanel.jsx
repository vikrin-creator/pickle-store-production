import { useState, useEffect } from 'react';

const AdminPanel = ({ onBackToHome, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Pickles',
    featured: false,
    rating: 0,
    reviews: 0,
    image: ''
  });
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [weightOptions, setWeightOptions] = useState([
    { weight: '250g', price: 150 },
    { weight: '500g', price: 280 },
    { weight: '1kg', price: 520 }
  ]);

  // Default products for initialization
  const defaultProducts = [
    {
      id: 1,
      name: "Mango Tango",
      description: "Sweet and tangy mango pickle - Made with fresh mangoes and traditional spices",
      price: 12.99,
      category: "Vegetarian",
      spiceLevel: "Medium",
      region: "South Indian",
      image: "/assets/MangoTango.png",
      weightOptions: [
        { weight: '250g', price: 12.99 },
        { weight: '500g', price: 22.99 },
        { weight: '1kg', price: 42.99 }
      ]
    },
    {
      id: 2,
      name: "Lime Zest",
      description: "Zesty lime pickle with a hint of spice - Fresh limes with aromatic spices",
      price: 10.99,
      category: "Vegetarian",
      spiceLevel: "Mild",
      region: "Gujarati",
      image: "/assets/Limezest.png",
      weightOptions: [
        { weight: '200g', price: 10.99 },
        { weight: '400g', price: 19.99 },
        { weight: '800g', price: 37.99 }
      ]
    },
    {
      id: 3,
      name: "Chili Kick",
      description: "Fiery chili pickle for the brave - Extra hot and flavorful",
      price: 14.99,
      category: "Vegetarian",
      spiceLevel: "Extra Hot",
      region: "North Indian",
      image: "/assets/Chillikick.png",
      weightOptions: [
        { weight: '150g', price: 14.99 },
        { weight: '300g', price: 27.99 },
        { weight: '600g', price: 52.99 }
      ]
    },
    {
      id: 4,
      name: "Garlic Burst",
      description: "Bold garlic pickle with a savory flavor - Rich and aromatic",
      price: 11.99,
      category: "Vegetarian",
      spiceLevel: "Hot",
      region: "Gujarati",
      image: "/assets/Garlic.png",
      weightOptions: [
        { weight: '250g', price: 11.99 },
        { weight: '500g', price: 21.99 },
        { weight: '1kg', price: 40.99 }
      ]
    },
    {
      id: 5,
      name: "Mixed Veggie Medley",
      description: "A delightful mix of seasonal vegetables - Traditional recipe",
      price: 13.49,
      category: "Vegetarian",
      spiceLevel: "Medium",
      region: "North Indian",
      image: "/assets/MixedVegetablePickle.png",
      weightOptions: [
        { weight: '250g', price: 13.49 },
        { weight: '500g', price: 24.99 },
        { weight: '1kg', price: 46.99 }
      ]
    },
    {
      id: 6,
      name: "Spicy Chicken",
      description: "Savory chicken pickle with a spicy kick - Non-vegetarian delight",
      price: 18.99,
      category: "Non-Vegetarian",
      spiceLevel: "Hot",
      region: "South Indian",
      image: "/assets/chicken.png",
      weightOptions: [
        { weight: '200g', price: 18.99 },
        { weight: '400g', price: 35.99 },
        { weight: '800g', price: 68.99 }
      ]
    },
    {
      id: 7,
      name: "Mirchi Pickle",
      description: "Traditional green chili pickle - Authentic and spicy",
      price: 15.99,
      category: "Vegetarian",
      spiceLevel: "Extra Hot",
      region: "North Indian",
      image: "/assets/Mirchi.png",
      weightOptions: [
        { weight: '200g', price: 15.99 },
        { weight: '400g', price: 29.99 },
        { weight: '800g', price: 56.99 }
      ]
    },
    {
      id: 8,
      name: "Garlic Seed Special",
      description: "Special garlic seed pickle - Unique flavor combination",
      price: 16.99,
      category: "Vegetarian",
      spiceLevel: "Medium",
      region: "South Indian",
      image: "/assets/GarlicSeed.png",
      weightOptions: [
        { weight: '250g', price: 16.99 },
        { weight: '500g', price: 31.99 },
        { weight: '1kg', price: 59.99 }
      ]
    },
    {
      id: 9,
      name: "Mango Jar Special",
      description: "Premium mango pickle in traditional jar - Family recipe",
      price: 18.99,
      category: "Vegetarian",
      spiceLevel: "Medium",
      region: "South Indian",
      image: "/assets/MangoJar.png"
    },
    {
      id: 10,
      name: "Neem Jar Pickle",
      description: "Traditional neem-infused pickle - Health benefits included",
      price: 20.99,
      category: "Vegetarian",
      spiceLevel: "Mild",
      region: "South Indian",
      image: "/assets/Neemjar.png"
    }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const response = await fetch('https://pickle-store-backend.onrender.com/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to load products from API');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          image: reader.result // Store base64 string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = async () => {
    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('weights', JSON.stringify(weightOptions));
      formDataToSend.append('featured', formData.featured || false);
      formDataToSend.append('rating', formData.rating || 0);
      formDataToSend.append('reviews', formData.reviews || 0);
      
      if (selectedImageFile) {
        formDataToSend.append('image', selectedImageFile);
      } else if (!editingProduct && !selectedImageFile) {
        alert('Please select an image for the product');
        return;
      }

      const url = editingProduct 
        ? `https://pickle-store-backend.onrender.com/api/admin/products/${editingProduct._id}`
        : 'https://pickle-store-backend.onrender.com/api/admin/products';
      
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: formDataToSend
      });

      if (response.ok) {
        const savedProduct = await response.json();
        
        if (editingProduct) {
          // Update existing product in local state
          setProducts(products.map(p => 
            p._id === editingProduct._id ? savedProduct : p
          ));
        } else {
          // Add new product to local state
          setProducts([...products, savedProduct]);
        }

        // Reset form
        setFormData({
          name: '',
          description: '',
          category: 'Pickles',
          featured: false,
          rating: 0,
          reviews: 0,
          image: ''
        });
        setWeightOptions([
          { weight: '250g', price: 150 },
          { weight: '500g', price: 280 },
          { weight: '1kg', price: 520 }
        ]);
        setSelectedImageFile(null);
        setImagePreview('');
        setShowAddForm(false);
        setEditingProduct(null);

        alert(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
      } else {
        const error = await response.json();
        alert(`Failed to save product: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      featured: product.featured,
      rating: product.rating,
      reviews: product.reviews,
      image: product.image
    });
    // Set weight options from the product weights
    setWeightOptions(product.weights || [
      { weight: '250g', price: 150 },
      { weight: '500g', price: 280 },
      { weight: '1kg', price: 520 }
    ]);
    setImagePreview(product.image);
    setSelectedImageFile(null);
    setShowAddForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product? This will also delete its image from the database.')) {
      try {
        const response = await fetch(`https://pickle-store-backend.onrender.com/api/admin/products/${productId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          // Remove product from local state
          const updatedProducts = products.filter(product => product._id !== productId);
          setProducts(updatedProducts);
          alert('Product and associated image deleted successfully!');
        } else {
          const error = await response.json();
          alert(`Failed to delete product: ${error.error}`);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  const handleCancelEdit = () => {
    setShowAddForm(false);
    setEditingProduct(null);
    setSelectedImageFile(null);
    setImagePreview('');
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Vegetarian',
      spiceLevel: 'Medium',
      region: 'South Indian',
      image: ''
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f7f6] font-sans text-[#221c10]">
      {/* Header */}
      <header className="sticky top-0 z-20 w-full border-b border-[#ecab13]/20 bg-[#2d6700]/90 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 sm:px-8 py-4">
          <div className="flex items-center">
            <img 
              src="/assets/logo.png"
              alt="Janiitra Logo"
              className="h-6 w-36 sm:h-8 sm:w-48 object-contain"
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
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
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

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('products')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'products'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Products
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={product.image ? (product.image.startsWith('/api/') ? `https://pickle-store-backend.onrender.com${product.image}` : product.image) : 'https://via.placeholder.com/300x200'}
                alt={product.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  console.log('AdminPanel: Image failed to load:', product.image);
                  e.target.src = 'https://via.placeholder.com/300x200';
                }}
                onLoad={() => {
                  console.log('AdminPanel: Image loaded successfully:', product.image);
                }}
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                <div className="mb-2">
                  {product.weights && product.weights.length > 0 && (
                    <div className="text-sm text-gray-700">
                      <span className="font-semibold">Prices: </span>
                      {product.weights.map((w, idx) => (
                        <span key={idx} className="text-[#ecab13] font-bold">
                          {w.weight}: ₹{w.price}{idx < product.weights.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 text-xs mb-3">
                  <span className="bg-gray-100 px-2 py-1 rounded">{product.category}</span>
                  {product.featured && <span className="bg-yellow-100 px-2 py-1 rounded text-yellow-800">Featured</span>}
                  {product.rating && <span className="bg-green-100 px-2 py-1 rounded text-green-800">★ {product.rating}</span>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product._id)}
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

                  {/* Weight Options Section */}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-3">Weight & Pricing Options</label>
                    <div className="space-y-3">
                      {weightOptions.map((option, index) => (
                        <div key={index} className="flex gap-3 items-center">
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="Weight (e.g., 250g)"
                              value={option.weight}
                              onChange={(e) => {
                                const newOptions = [...weightOptions];
                                newOptions[index].weight = e.target.value;
                                setWeightOptions(newOptions);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                            />
                          </div>
                          <div className="flex-1">
                            <input
                              type="number"
                              step="0.01"
                              placeholder="Price"
                              value={option.price}
                              onChange={(e) => {
                                const newOptions = [...weightOptions];
                                newOptions[index].price = parseFloat(e.target.value) || 0;
                                setWeightOptions(newOptions);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newOptions = weightOptions.filter((_, i) => i !== index);
                              setWeightOptions(newOptions);
                            }}
                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setWeightOptions([...weightOptions, { weight: '', price: 0 }]);
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Add Weight Option
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ecab13]"
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-lg border border-gray-300"
                        />
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Upload an image file (JPG, PNG, etc.)</p>
                  </div>
                </div>
                
                {/* Form Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSaveProduct}
                    disabled={!formData.name || !formData.description || !formData.price}
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
        </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;