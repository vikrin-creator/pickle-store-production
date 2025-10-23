import Footer from './Footer';
import { useEffect } from 'react';

const TermsConditionsPage = ({ onNavigateHome, onNavigateToProducts }) => {
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
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b border-[#ecab13]/20 bg-[#2d6700] bg-opacity-90 px-4 sm:px-10 py-4 backdrop-blur-fallback">
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
          <span className="text-base font-medium text-[#ecab13]">Terms & Conditions</span>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-16 md:pt-20 pb-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2d6700] mb-4">Terms & Conditions</h1>
          <p className="text-lg text-[#221c10]/70">
            Last updated: October 23, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          
          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">1. Acceptance of Terms</h2>
            <p className="text-[#221c10]/80 leading-relaxed">
              Welcome to Janiitra Pickles. These Terms and Conditions ("Terms") govern your use of our website and services. By accessing or using our website, placing an order, or using our services, you agree to be bound by these Terms. If you do not agree with these Terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">2. About Janiitra Pickles</h2>
            <p className="text-[#221c10]/80 leading-relaxed">
              Janiitra Pickles is an e-commerce platform specializing in authentic, handcrafted Indian pickles made with traditional recipes and organic ingredients. We are committed to delivering high-quality products and exceptional customer service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">3. Products and Services</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#221c10] mb-2">Product Information</h3>
                <p className="text-[#221c10]/80 leading-relaxed">
                  We strive to provide accurate descriptions, images, and pricing for all our products. However, we do not warrant that product descriptions or other content is error-free, complete, reliable, current, or accurate.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#221c10] mb-2">Availability</h3>
                <p className="text-[#221c10]/80 leading-relaxed">
                  All products are subject to availability. We reserve the right to discontinue any product at any time without notice.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">4. Orders and Payment</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#221c10] mb-2">Order Placement</h3>
                <p className="text-[#221c10]/80 leading-relaxed">
                  When you place an order, you are making an offer to purchase products. We reserve the right to accept or decline your order for any reason.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#221c10] mb-2">Payment Terms</h3>
                <ul className="list-disc list-inside text-[#221c10]/80 space-y-1 ml-4">
                  <li>We accept Cash on Delivery (COD) and online payment methods</li>
                  <li>All prices are in Indian Rupees (INR)</li>
                  <li>Prices include applicable taxes unless stated otherwise</li>
                  <li>Payment must be completed before order processing</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#221c10] mb-2">Order Confirmation</h3>
                <p className="text-[#221c10]/80 leading-relaxed">
                  You will receive an email confirmation once your order is placed and another when it's shipped.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">5. Shipping and Delivery</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#221c10] mb-2">Delivery Areas</h3>
                <p className="text-[#221c10]/80 leading-relaxed">
                  We currently deliver across India. Delivery times may vary based on location and product availability.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#221c10] mb-2">Delivery Times</h3>
                <ul className="list-disc list-inside text-[#221c10]/80 space-y-1 ml-4">
                  <li>Standard delivery: 3-7 business days</li>
                  <li>Express delivery: 1-3 business days (where available)</li>
                  <li>Remote areas may require additional time</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#221c10] mb-2">Shipping Charges</h3>
                <p className="text-[#221c10]/80 leading-relaxed">
                  Shipping charges are calculated based on weight, distance, and delivery speed. Free shipping may be available for orders above certain amounts.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">6. Returns and Refunds</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#221c10] mb-2">Return Policy</h3>
                <p className="text-[#221c10]/80 leading-relaxed">
                  Due to the perishable nature of our food products, we generally do not accept returns unless the product is damaged or defective upon delivery.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#221c10] mb-2">Refund Conditions</h3>
                <ul className="list-disc list-inside text-[#221c10]/80 space-y-1 ml-4">
                  <li>Products must be reported as damaged within 24 hours of delivery</li>
                  <li>Photo evidence may be required for damage claims</li>
                  <li>Refunds will be processed within 5-7 business days</li>
                  <li>COD orders will receive bank transfer refunds</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">7. User Accounts</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#221c10] mb-2">Account Creation</h3>
                <p className="text-[#221c10]/80 leading-relaxed">
                  You may create an account to enhance your shopping experience. You are responsible for maintaining the confidentiality of your account credentials.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#221c10] mb-2">Account Responsibilities</h3>
                <ul className="list-disc list-inside text-[#221c10]/80 space-y-1 ml-4">
                  <li>Provide accurate and current information</li>
                  <li>Keep your password secure</li>
                  <li>Notify us of any unauthorized account use</li>
                  <li>Use the account only for lawful purposes</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">8. Prohibited Uses</h2>
            <p className="text-[#221c10]/80 leading-relaxed mb-4">
              You may not use our website or services for any unlawful purpose or in any way that could damage, disable, or impair our services. Prohibited activities include:
            </p>
            <ul className="list-disc list-inside text-[#221c10]/80 space-y-2 ml-4">
              <li>Violating any applicable laws or regulations</li>
              <li>Transmitting malicious code or viruses</li>
              <li>Attempting to gain unauthorized access to our systems</li>
              <li>Interfering with other users' experience</li>
              <li>Using our content without permission</li>
              <li>Engaging in fraudulent activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">9. Intellectual Property</h2>
            <p className="text-[#221c10]/80 leading-relaxed">
              All content on our website, including text, images, logos, and designs, is protected by copyright and other intellectual property laws. You may not use, reproduce, or distribute our content without express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">10. Disclaimers and Limitation of Liability</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#221c10] mb-2">Service Disclaimer</h3>
                <p className="text-[#221c10]/80 leading-relaxed">
                  Our services are provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free service.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#221c10] mb-2">Limitation of Liability</h3>
                <p className="text-[#221c10]/80 leading-relaxed">
                  To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">11. Indemnification</h2>
            <p className="text-[#221c10]/80 leading-relaxed">
              You agree to indemnify and hold harmless Janiitra Pickles from any claims, damages, or expenses arising from your use of our services or violation of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">12. Governing Law</h2>
            <p className="text-[#221c10]/80 leading-relaxed">
              These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana, India.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">13. Changes to Terms</h2>
            <p className="text-[#221c10]/80 leading-relaxed">
              We reserve the right to modify these Terms at any time. Updated Terms will be posted on our website with a new "Last updated" date. Your continued use of our services constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">14. Termination</h2>
            <p className="text-[#221c10]/80 leading-relaxed">
              We may terminate or suspend your account and access to our services at any time for violation of these Terms or for any other reason at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">15. Contact Information</h2>
            <p className="text-[#221c10]/80 leading-relaxed mb-4">
              If you have any questions about these Terms & Conditions, please contact us:
            </p>
            <div className="bg-[#f8f7f6] rounded-lg p-6 space-y-2">
              <p className="text-[#221c10]/80"><strong>Email:</strong> legal@janiitra.com</p>
              <p className="text-[#221c10]/80"><strong>Phone:</strong> +91 778 0197 494</p>
              <p className="text-[#221c10]/80"><strong>Address:</strong> Janiitra Pickles, Hyderabad, Telangana, India</p>
            </div>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">16. Entire Agreement</h2>
            <p className="text-[#221c10]/80 leading-relaxed">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and Janiitra Pickles regarding your use of our services.
            </p>
          </section>

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

export default TermsConditionsPage;