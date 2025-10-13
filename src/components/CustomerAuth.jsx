import { useState } from 'react';
import authService from '../services/authService';

const CustomerAuth = ({ onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // For signup, validate additional fields
    if (!isLogin) {
      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      let result;
      
      if (isLogin) {
        // Use authService for login
        result = await authService.login(formData.email, formData.password);
      } else {
        // Use authService for registration
        const userData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone
        };
        result = await authService.register(userData);
      }

      if (result.success) {
        // Call success callback with user data
        onSuccess(result.user);
        
        // Close modal
        onClose();
      } else {
        setErrors({ submit: result.message || 'Authentication failed' });
      }
    } catch (error) {
      console.error('Auth error:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: ''
    });
    setErrors({});
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="relative w-full max-w-md my-8 mx-auto">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0 bg-cover bg-center opacity-20 rounded-xl" style={{
          backgroundImage: 'url("https://res.cloudinary.com/janiitra-pickles/image/upload/v1760011588/pickle-store/1760011587794-ChatGPT-Image-Oct-7%2C-2025%2C-07_28_52-PM.png")'
        }}></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-orange-50/50 via-orange-50 to-orange-50 rounded-xl"></div>
        
        <div className="relative z-20 flex flex-col bg-white/90 rounded-xl shadow-2xl backdrop-blur-sm min-h-[500px] max-h-[90vh] overflow-y-auto">
          {/* Header with Logo */}
          <header className="px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between text-amber-900">
              <div className="flex items-center gap-3">
                <img 
                  src="/assets/logo.png" 
                  alt="Janiitra Pickles" 
                  className="w-12 h-12 sm:w-14 sm:h-14"
                  onError={(e) => {
                    // Fallback to a spice/pickle icon if logo fails
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <svg 
                  className="h-12 w-12 sm:h-14 sm:w-14 text-orange-500 hidden" 
                  fill="none" 
                  viewBox="0 0 48 48" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor"></path>
                </svg>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight">Janiitra Pickles</h1>
              </div>
              {/* Close Button */}
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors z-20"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </header>

          {/* Main Auth Form */}
          <main className="flex-1 py-4 px-6">
            <div className="w-full">
              {/* Tab Buttons */}
              <div className="mb-6 flex rounded-lg border border-orange-200 bg-orange-50 p-1">
                <button 
                  onClick={() => setIsLogin(true)}
                  className={`w-1/2 rounded-md py-2.5 text-base font-bold transition-colors ${
                    isLogin 
                      ? 'bg-orange-500 text-white' 
                      : 'text-amber-700 hover:text-orange-500'
                  }`}
                >
                  Login
                </button>
                <button 
                  onClick={() => setIsLogin(false)}
                  className={`w-1/2 rounded-md py-2.5 text-base font-bold transition-colors ${
                    !isLogin 
                      ? 'bg-orange-500 text-white' 
                      : 'text-amber-700 hover:text-orange-500'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* First Name & Last Name (Signup only) */}
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-amber-900" htmlFor="firstName">
                        First Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="firstName"
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`w-full rounded-lg border p-3 text-amber-900 placeholder-amber-600 ring-1 ring-inset ring-transparent transition-all focus:border-orange-500 focus:ring-2 focus:ring-inset focus:ring-orange-500 ${
                            errors.firstName ? 'border-red-500' : 'border-orange-300'
                          }`}
                          placeholder="First name"
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-amber-900" htmlFor="lastName">
                        Last Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="lastName"
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={`w-full rounded-lg border p-3 text-amber-900 placeholder-amber-600 ring-1 ring-inset ring-transparent transition-all focus:border-orange-500 focus:ring-2 focus:ring-inset focus:ring-orange-500 ${
                            errors.lastName ? 'border-red-500' : 'border-orange-300'
                          }`}
                          placeholder="Last name"
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-amber-900" htmlFor="email">
                    Email Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border p-3 text-amber-900 placeholder-amber-600 ring-1 ring-inset ring-transparent transition-all focus:border-orange-500 focus:ring-2 focus:ring-inset focus:ring-orange-500 ${
                        errors.email ? 'border-red-500' : 'border-orange-300'
                      }`}
                      placeholder="you@example.com"
                      required
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Phone (Signup only) */}
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-amber-900" htmlFor="phone">
                      Phone Number
                    </label>
                    <div className="mt-1">
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full rounded-lg border p-3 text-amber-900 placeholder-amber-600 ring-1 ring-inset ring-transparent transition-all focus:border-orange-500 focus:ring-2 focus:ring-inset focus:ring-orange-500 ${
                          errors.phone ? 'border-red-500' : 'border-orange-300'
                        }`}
                        placeholder="Your phone number"
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-amber-900" htmlFor="password">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border p-3 text-amber-900 placeholder-amber-600 ring-1 ring-inset ring-transparent transition-all focus:border-orange-500 focus:ring-2 focus:ring-inset focus:ring-orange-500 ${
                        errors.password ? 'border-red-500' : 'border-orange-300'
                      }`}
                      placeholder="••••••••"
                      required
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                  </div>
                </div>

                {/* Confirm Password (Signup only) */}
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-amber-900" htmlFor="confirmPassword">
                      Confirm Password
                    </label>
                    <div className="mt-1">
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full rounded-lg border p-3 text-amber-900 placeholder-amber-600 ring-1 ring-inset ring-transparent transition-all focus:border-orange-500 focus:ring-2 focus:ring-inset focus:ring-orange-500 ${
                          errors.confirmPassword ? 'border-red-500' : 'border-orange-300'
                        }`}
                        placeholder="••••••••"
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Forgot Password (Login only) */}
                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <a className="font-medium text-orange-600 transition-colors hover:text-orange-500" href="#">
                        Forgot your password?
                      </a>
                    </div>
                  </div>
                )}

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{errors.submit}</p>
                  </div>
                )}

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg bg-orange-500 px-4 py-3 text-lg font-bold text-white transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {isLogin ? 'Logging In...' : 'Creating Account...'}
                      </div>
                    ) : (
                      isLogin ? 'Login' : 'Create Account'
                    )}
                  </button>
                </div>
              </form>

              {/* Toggle Link */}
              <p className="mt-8 text-center text-sm text-amber-700">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  onClick={toggleMode}
                  className="ml-2 font-medium text-orange-600 transition-colors hover:text-orange-500"
                >
                  {isLogin ? 'Sign up' : 'Login'}
                </button>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CustomerAuth;