import Footer from './Footer';
import { useEffect } from 'react';

const ShippingReturnPage = ({ onNavigateHome, onNavigateToProducts }) => {
  useEffect(() => {
    // Define navigation functions
    window.navigateToHome = () => {
      window.location.href = '/';
    };
    
    window.navigateToProducts = () => {
      window.location.href = '/#products';
    };
    
    window.navigateToStories = () => {
      window.location.href = '/stories';
    };
    
    window.navigateToContact = () => {
      window.location.href = '/contact';
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f7f6] font-sans text-[#221c10]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-[#ecab13]/20 bg-[#2d6700] bg-opacity-90 px-4 sm:px-10 py-4 backdrop-blur-fallback">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="/assets/logo.png"
            alt="Janiitra Logo"
            className="h-6 w-36 sm:h-8 sm:w-48 object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => window.navigateToHome && window.navigateToHome()}
          />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => window.navigateToHome && window.navigateToHome()}
            className="text-base font-medium transition-colors duration-200 text-white hover:text-[#ecab13]"
          >
            Home
          </button>
          <button 
            onClick={() => window.navigateToProducts && window.navigateToProducts()}
            className="text-base font-medium transition-colors duration-200 text-white hover:text-[#ecab13]"
          >
            Shop
          </button>
          <button 
            onClick={() => window.navigateToStories && window.navigateToStories()}
            className="text-base font-medium transition-colors duration-200 text-white hover:text-[#ecab13]"
          >
            Stories
          </button>
          <a href="#about" className="text-base font-medium transition-colors duration-200 text-white hover:text-[#ecab13]">
            About
          </a>
          <button 
            onClick={() => window.navigateToContact && window.navigateToContact()}
            className="text-base font-medium transition-colors duration-200 text-white hover:text-[#ecab13]"
          >
            Contact
          </button>
          <span className="text-base font-medium text-[#ecab13]">Shipping & Returns</span>
        </nav>

        {/* Back Button */}
        <button
          onClick={() => window.navigateToHome && window.navigateToHome()}
          className="flex items-center gap-2 text-white hover:text-[#ecab13] transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-20 md:pt-24 pb-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2d6700] mb-4">Shipping & Return Policies</h1>
          <p className="text-lg text-[#221c10]/70">
            Everything you need to know about delivery and returns
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          
          {/* Shipping Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-6 flex items-center gap-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Shipping Information
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#221c10] mb-3">Delivery Areas</h3>
                <p className="text-[#221c10]/80 leading-relaxed mb-3">
                  We deliver authentic Indian pickles across India! Whether you're in a metro city or a remote village, we'll bring the taste of tradition to your doorstep.
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800 font-medium">🌟 Pan-India Delivery Available</p>
                  <p className="text-green-700 text-sm mt-1">Currently serving all states and union territories</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#221c10] mb-3">Delivery Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-[#2d6700] mb-2">🏃‍♂️ Express Delivery</h4>
                    <p className="text-[#221c10]/80 text-sm mb-2">Metro cities & major towns</p>
                    <p className="font-bold text-[#ecab13]">1-3 Business Days</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-[#2d6700] mb-2">📦 Standard Delivery</h4>
                    <p className="text-[#221c10]/80 text-sm mb-2">All other locations</p>
                    <p className="font-bold text-[#ecab13]">3-7 Business Days</p>
                  </div>
                </div>
                <p className="text-[#221c10]/70 text-sm mt-3">
                  *Delivery times may vary during festivals, monsoons, or due to unforeseen circumstances
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#221c10] mb-3">Shipping Charges</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 rounded-lg">
                    <thead>
                      <tr className="bg-[#f8f7f6]">
                        <th className="border border-gray-300 px-4 py-3 text-left">Order Value</th>
                        <th className="border border-gray-300 px-4 py-3 text-left">Shipping Charge</th>
                        <th className="border border-gray-300 px-4 py-3 text-left">Delivery Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3">Below ₹500</td>
                        <td className="border border-gray-300 px-4 py-3">₹50</td>
                        <td className="border border-gray-300 px-4 py-3">Standard</td>
                      </tr>
                      <tr className="bg-[#f8f7f6]/50">
                        <td className="border border-gray-300 px-4 py-3">₹500 - ₹999</td>
                        <td className="border border-gray-300 px-4 py-3">₹30</td>
                        <td className="border border-gray-300 px-4 py-3">Standard</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 font-semibold">₹1000 & Above</td>
                        <td className="border border-gray-300 px-4 py-3 font-semibold text-green-600">FREE</td>
                        <td className="border border-gray-300 px-4 py-3">Standard/Express</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#221c10] mb-3">Packaging & Handling</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#ecab13] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-[#221c10]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-[#221c10]/80">Secure packaging to prevent damage during transit</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#ecab13] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-[#221c10]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-[#221c10]/80">Food-grade materials for freshness preservation</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#ecab13] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-[#221c10]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-[#221c10]/80">Temperature-controlled packaging for quality assurance</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#221c10] mb-3">Order Tracking</h3>
                <p className="text-[#221c10]/80 leading-relaxed">
                  Once your order is shipped, you'll receive a tracking number via SMS and email. You can track your package in real-time and know exactly when your delicious pickles will arrive!
                </p>
              </div>
            </div>
          </div>

          {/* Returns Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-6 flex items-center gap-3">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Return & Refund Policy
            </h2>
            
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-amber-800 mb-3">🍯 Food Safety First</h3>
                <p className="text-amber-700 leading-relaxed">
                  Due to the perishable nature of our handcrafted pickles and food safety regulations, we follow a strict return policy to ensure product quality and customer safety.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#221c10] mb-3">When Returns Are Accepted</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.992-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#221c10]/80 font-medium">Damaged During Transit</p>
                      <p className="text-[#221c10]/70 text-sm">Broken jar, leaked product, or visible damage</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.992-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#221c10]/80 font-medium">Wrong Product Delivered</p>
                      <p className="text-[#221c10]/70 text-sm">Different pickle variety or size than ordered</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.992-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#221c10]/80 font-medium">Quality Issues</p>
                      <p className="text-[#221c10]/70 text-sm">Expired, spoiled, or contaminated product</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#221c10] mb-3">Return Process</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-[#ecab13] rounded-full flex items-center justify-center text-[#221c10] font-bold">1</div>
                    <div>
                      <p className="font-medium text-[#221c10]">Report Issue Immediately</p>
                      <p className="text-[#221c10]/70 text-sm">Contact us within 24 hours of delivery</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-[#ecab13] rounded-full flex items-center justify-center text-[#221c10] font-bold">2</div>
                    <div>
                      <p className="font-medium text-[#221c10]">Provide Photo Evidence</p>
                      <p className="text-[#221c10]/70 text-sm">Clear pictures of the product and packaging</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-[#ecab13] rounded-full flex items-center justify-center text-[#221c10] font-bold">3</div>
                    <div>
                      <p className="font-medium text-[#221c10]">Quick Resolution</p>
                      <p className="text-[#221c10]/70 text-sm">We'll process your return within 2 business days</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#221c10] mb-3">Refund Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-[#2d6700] mb-2">💰 Full Refund</h4>
                    <p className="text-[#221c10]/80 text-sm mb-2">For damaged or wrong products</p>
                    <p className="text-[#221c10]/70 text-sm">Processed within 5-7 business days</p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-[#2d6700] mb-2">🔄 Product Replacement</h4>
                    <p className="text-[#221c10]/80 text-sm mb-2">Fresh product shipped at no extra cost</p>
                    <p className="text-[#221c10]/70 text-sm">Usually preferred option</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#221c10] mb-3">What We Don't Accept</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p className="text-[#221c10]/80">Returns due to change of mind or taste preference</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p className="text-[#221c10]/80">Products returned after 24 hours without valid reason</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <p className="text-[#221c10]/80">Partially consumed products (unless quality issue)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-[#2d6700] text-white rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">Need Help with Your Order?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#ecab13] rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[#221c10]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-sm opacity-90">+91 778 0197 494</p>
                <p className="text-xs opacity-75">Mon-Sat: 9AM-7PM</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#ecab13] rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[#221c10]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">WhatsApp</h3>
                <p className="text-sm opacity-90">Quick Support</p>
                <p className="text-xs opacity-75">Instant replies</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#ecab13] rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-[#221c10]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Email</h3>
                <p className="text-sm opacity-90">support@janiitra.com</p>
                <p className="text-xs opacity-75">24-48 hrs response</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-12 space-y-4">
          <button
            onClick={() => window.navigateToHome && window.navigateToHome()}
            className="bg-[#ecab13] text-[#221c10] px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200 mr-4"
          >
            Back to Home
          </button>
          <button
            onClick={() => window.navigateToProducts && window.navigateToProducts()}
            className="border-2 border-[#ecab13] text-[#ecab13] px-8 py-3 rounded-lg font-semibold hover:bg-[#ecab13] hover:text-[#221c10] transition-all duration-200"
          >
            Start Shopping
          </button>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ShippingReturnPage;