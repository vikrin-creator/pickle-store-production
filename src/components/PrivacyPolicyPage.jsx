const PrivacyPolicyPage = ({ onNavigateHome, onNavigateToProducts }) => {
  return (
    <div className="min-h-screen bg-[#f8f7f6] font-sans text-[#221c10]">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#ecab13]/20 bg-[#2d6700] bg-opacity-90 px-4 sm:px-10 py-4 backdrop-blur-fallback">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="/assets/logo.png"
            alt="Janiitra Logo"
            className="h-6 w-36 sm:h-8 sm:w-48 object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={onNavigateHome}
          />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={onNavigateHome}
            className="text-base font-medium transition-colors duration-200 text-white hover:text-[#ecab13]"
          >
            Home
          </button>
          <button 
            onClick={onNavigateToProducts}
            className="text-base font-medium transition-colors duration-200 text-white hover:text-[#ecab13]"
          >
            Shop
          </button>
          <span className="text-base font-medium text-[#ecab13]">Privacy Policy</span>
        </nav>

        {/* Back Button */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-white hover:text-[#ecab13] transition-colors duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2d6700] mb-4">Privacy Policy</h1>
          <p className="text-lg text-[#221c10]/70">
            Last updated: October 23, 2025
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          
          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">1. Introduction</h2>
            <p className="text-[#221c10]/80 leading-relaxed">
              Welcome to Janiitra Pickles ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase from us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">2. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#221c10] mb-2">Personal Information</h3>
                <p className="text-[#221c10]/80 leading-relaxed mb-2">
                  We collect personal information that you provide to us when you:
                </p>
                <ul className="list-disc list-inside text-[#221c10]/80 space-y-1 ml-4">
                  <li>Create an account</li>
                  <li>Make a purchase</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Contact us for customer support</li>
                  <li>Participate in surveys or promotions</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-[#221c10] mb-2">Information Collected Automatically</h3>
                <p className="text-[#221c10]/80 leading-relaxed">
                  When you visit our website, we may automatically collect certain information about your device and browsing behavior, including IP address, browser type, operating system, referring URLs, and pages visited.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">3. How We Use Your Information</h2>
            <p className="text-[#221c10]/80 leading-relaxed mb-4">
              We use the information we collect for various purposes, including:
            </p>
            <ul className="list-disc list-inside text-[#221c10]/80 space-y-2 ml-4">
              <li>Process and fulfill your orders</li>
              <li>Provide customer service and support</li>
              <li>Send you updates about your orders</li>
              <li>Improve our website and services</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Prevent fraud and enhance security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-[#221c10]/80 leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share your information in the following situations:
            </p>
            <ul className="list-disc list-inside text-[#221c10]/80 space-y-2 ml-4">
              <li>With service providers who help us operate our business</li>
              <li>To comply with legal requirements or protect our rights</li>
              <li>In connection with a business transfer or merger</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">5. Data Security</h2>
            <p className="text-[#221c10]/80 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">6. Cookies and Tracking Technologies</h2>
            <p className="text-[#221c10]/80 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie settings through your browser preferences.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">7. Your Rights and Choices</h2>
            <p className="text-[#221c10]/80 leading-relaxed mb-4">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-[#221c10]/80 space-y-2 ml-4">
              <li>Access and review your personal information</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Delete your personal information</li>
              <li>Object to or restrict processing of your information</li>
              <li>Data portability</li>
              <li>Withdraw consent (where applicable)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">8. Third-Party Links</h2>
            <p className="text-[#221c10]/80 leading-relaxed">
              Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies before providing any personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">9. Children's Privacy</h2>
            <p className="text-[#221c10]/80 leading-relaxed">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">10. International Data Transfers</h2>
            <p className="text-[#221c10]/80 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information during such transfers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">11. Changes to This Policy</h2>
            <p className="text-[#221c10]/80 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date. Your continued use of our services after changes are posted constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">12. Contact Us</h2>
            <p className="text-[#221c10]/80 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="bg-[#f8f7f6] rounded-lg p-6 space-y-2">
              <p className="text-[#221c10]/80"><strong>Email:</strong> privacy@janiitra.com</p>
              <p className="text-[#221c10]/80"><strong>Phone:</strong> +91 778 0197 494</p>
              <p className="text-[#221c10]/80"><strong>Address:</strong> Janiitra Pickles, Hyderabad, Telangana, India</p>
            </div>
          </section>

          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-4">13. Consent</h2>
            <p className="text-[#221c10]/80 leading-relaxed">
              By using our website and services, you consent to the collection and use of your information as described in this Privacy Policy. If you do not agree with this policy, please do not use our services.
            </p>
          </section>

        </div>

        {/* Action Buttons */}
        <div className="text-center mt-12 space-y-4">
          <button
            onClick={onNavigateHome}
            className="bg-[#ecab13] text-[#221c10] px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200 mr-4"
          >
            Back to Home
          </button>
          <button
            onClick={onNavigateToProducts}
            className="border-2 border-[#ecab13] text-[#ecab13] px-8 py-3 rounded-lg font-semibold hover:bg-[#ecab13] hover:text-[#221c10] transition-all duration-200"
          >
            Start Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;