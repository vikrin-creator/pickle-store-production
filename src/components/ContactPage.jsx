import { useState } from 'react';
import { api } from '../services/api';
import Footer from './Footer';

const ContactPage = ({ onNavigateHome, onNavigateToProducts }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('Submitting contact form with data:', formData);
      const response = await api.post('/api/contact', formData);
      console.log('Contact form response:', response);
      
      if (response && response.success) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        alert(response?.message || 'Error sending message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      alert(error.message || 'Error sending message. Please try again later or contact us directly at janiitra.official@gmail.com');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f6] font-sans text-[#221c10]">
      {/* Header */}
      <header className="fixed left-0 right-0 z-40 flex items-center lg:justify-center justify-between border-b border-[#ecab13]/20 bg-[#2d6700] bg-opacity-90 px-4 sm:px-10 py-4 backdrop-blur-fallback">
        {/* Logo */}
        <div className="flex items-center lg:absolute lg:left-4 lg:sm:left-10">
          <img 
            src="/assets/logo.png"
            alt="Janiitra Logo"
            className="h-6 w-36 sm:h-8 sm:w-48 object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => window.navigateToHome && window.navigateToHome()}
          />
        </div>

        {/* Navigation - Hidden on mobile, shown on larger screens */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-8">
          <button 
            onClick={() => window.navigateToHome && window.navigateToHome()}
            className="text-sm xl:text-base font-medium transition-all duration-300 text-white hover:text-[#ecab13] hover:scale-110 relative group"
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ecab13] transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button 
            onClick={() => window.navigateToProducts && window.navigateToProducts()}
            className="text-sm xl:text-base font-medium transition-all duration-300 text-white hover:text-[#ecab13] hover:scale-110 relative group"
          >
            Shop
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ecab13] transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button 
            onClick={() => window.navigateToStories && window.navigateToStories()}
            className="text-sm xl:text-base font-medium transition-all duration-300 text-white hover:text-[#ecab13] hover:scale-110 relative group"
          >
            Stories
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ecab13] transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button 
            onClick={() => window.navigateToAbout && window.navigateToAbout()}
            className="text-sm xl:text-base font-medium transition-all duration-300 text-white hover:text-[#ecab13] hover:scale-110 relative group"
          >
            About
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ecab13] transition-all duration-300 group-hover:w-full"></span>
          </button>
          <span className="text-sm xl:text-base font-medium text-[#ecab13] relative">
            Contact
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ecab13]"></span>
          </span>
        </nav>

        {/* Mobile Actions - Menu Button */}
        <div className="lg:hidden flex items-center gap-3 lg:absolute lg:right-4 lg:sm:right-10">
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="text-white hover:text-[#ecab13] transition-colors duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showMobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="lg:hidden fixed top-16 right-4 z-40 bg-white border border-gray-200 shadow-lg rounded-lg mt-2 w-48">
          <nav className="py-2">
            <button 
              onClick={() => { window.navigateToHome && window.navigateToHome(); setShowMobileMenu(false); }}
              className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#2d6700] transition-colors duration-200 border-b border-gray-100"
            >
              Home
            </button>
            <button 
              onClick={() => { window.navigateToProducts && window.navigateToProducts(); setShowMobileMenu(false); }}
              className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#2d6700] transition-colors duration-200 border-b border-gray-100"
            >
              Shop
            </button>
            <button 
              onClick={() => { window.navigateToStories && window.navigateToStories(); setShowMobileMenu(false); }}
              className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#2d6700] transition-colors duration-200 border-b border-gray-100"
            >
              Stories
            </button>
            <button 
              onClick={() => { window.navigateToAbout && window.navigateToAbout(); setShowMobileMenu(false); }}
              className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#2d6700] transition-colors duration-200 border-b border-gray-100"
            >
              About
            </button>
            <span className="block px-4 py-3 text-[#2d6700] font-medium bg-gray-50">
              Contact
            </span>
          </nav>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-16 md:pt-20 pb-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2d6700] mb-4">Contact Us</h1>
          <p className="text-lg text-[#221c10]/70 max-w-2xl mx-auto">
            We'd love to hear from you! Get in touch with us for any questions about our authentic Indian pickles.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold text-[#2d6700] mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#ecab13] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#221c10]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#221c10] mb-2">Address</h3>
                    <p className="text-[#221c10]/70">
                      Janiitra Pickles<br />
                      Traditional Pickle Store<br />
                      Hyderabad, Telangana, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#ecab13] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#221c10]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#221c10] mb-2">Phone</h3>
                    <p className="text-[#221c10]/70">+91 789 3819 202</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#ecab13] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#221c10]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#221c10] mb-2">Email</h3>
                    <p className="text-[#221c10]/70">janiitra.official@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#ecab13] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#221c10]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#221c10] mb-2">Business Hours</h3>
                    <p className="text-[#221c10]/70">
                      Monday - Saturday: 9:00 AM - 7:00 PM<br />
                      Sunday: 10:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Contact */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-green-800">WhatsApp Support</h3>
              </div>
              <p className="text-green-700 mb-4">Quick support for orders, delivery, and product inquiries</p>
              <a 
                href="https://wa.me/917893819202" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-[#2d6700] mb-6">Send us a Message</h2>
            
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#2d6700] mb-2">Message Sent!</h3>
                <p className="text-[#221c10]/70 mb-6">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-[#ecab13] text-[#221c10] px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#221c10] mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ecab13] focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-[#221c10] mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ecab13] focus:border-transparent"
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#221c10] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ecab13] focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[#221c10] mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ecab13] focus:border-transparent"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="orders">Order Support</option>
                    <option value="products">Product Information</option>
                    <option value="delivery">Delivery Support</option>
                    <option value="wholesale">Wholesale Inquiry</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#221c10] mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ecab13] focus:border-transparent resize-none"
                    placeholder="Please describe your inquiry or message..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#ecab13] text-[#221c10] py-3 px-6 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Company Details */}
      <div className="bg-[#f8f7f6] border-t border-[#ecab13]/20 py-4 text-center">
        <p className="text-sm text-[#221c10]/80">
          © 2025 Janiitra Enterprises Pvt. Ltd. | CIN: U47213TS2025PTC194771
        </p>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ContactPage;