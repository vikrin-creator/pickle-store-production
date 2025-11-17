import { useState } from 'react';

const AboutPage = ({ onBack }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-stone-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#ecab13] rounded-full blur-3xl"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-orange-300 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-amber-200 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="fixed left-0 right-0 z-40 flex items-center justify-between border-b border-[#ecab13]/20 bg-[#2d6700] bg-opacity-90 px-4 sm:px-10 py-4 backdrop-blur-fallback">
        {/* Logo */}
        <div className="flex items-center">
          <img 
            src="/assets/logo.png"
            alt="Janiitra Logo"
            className="h-6 w-36 sm:h-8 sm:w-48 object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={onBack}
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-8 absolute left-1/2 -translate-x-1/2">
          <button 
            onClick={onBack}
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
          <span className="text-sm xl:text-base font-medium text-[#ecab13] relative">
            About
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ecab13]"></span>
          </span>
          <button 
            onClick={() => window.navigateToContact && window.navigateToContact()}
            className="text-sm xl:text-base font-medium transition-all duration-300 text-white hover:text-[#ecab13] hover:scale-110 relative group"
          >
            Contact
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#ecab13] transition-all duration-300 group-hover:w-full"></span>
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-3 ml-auto relative">
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
              onClick={() => { onBack(); setShowMobileMenu(false); }}
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
            <span className="block px-4 py-3 text-[#2d6700] font-medium bg-gray-50">
              About
            </span>
            <button 
              onClick={() => { window.navigateToContact && window.navigateToContact(); setShowMobileMenu(false); }}
              className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#2d6700] transition-colors duration-200"
            >
              Contact
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-block">
            <h1 className="text-6xl md:text-8xl font-bold text-gray-800 mb-6 relative">
              <span className="relative z-10">Janiitra</span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-[#ecab13] rounded-full"></div>
            </h1>
          </div>
          <p className="text-2xl md:text-3xl text-[#2d6700] font-light italic mb-8">
            Generator of Life
          </p>
        </div>

        {/* Story Cards */}
        <div className="space-y-16">
          
          {/* Philosophy Card */}
          <div className="rounded-3xl p-8 md:p-12 shadow-2xl border border-stone-300 transform hover:scale-[1.02] transition-transform duration-300" style={{backgroundColor: '#F4F1EB'}}>
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-[#2d6700] mb-6">
                Pure, Nurturing & Full of Soul
              </h2>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
                That's what good food should be. <span className="text-[#ecab13] font-semibold">Janiitra</span> represents 
                our commitment to creating meals that don't just satisfy hunger, but nourish the spirit and 
                connect us to our roots.
              </p>
            </div>
          </div>

          {/* Mission Card */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-[#2d6700]/10 to-[#ecab13]/15 backdrop-blur-sm rounded-3xl p-8 md:p-10 border border-[#2d6700]/20 shadow-lg">
              <h3 className="text-3xl font-bold text-[#2d6700] mb-6">Our Mission</h3>
              <p className="text-xl text-gray-700 leading-relaxed">
                We started Janiitra with one sacred mission: to resurrect the lost flavors of 
                traditional Indian kitchens using our <span className="text-[#ecab13] font-semibold">Grand Maa's time-honored recipes</span>.
              </p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-xl border border-gray-200">
              <h3 className="text-3xl font-bold text-[#2d6700] mb-6">The Problem</h3>
              <p className="text-xl text-gray-700 leading-relaxed">
                In today's fast-paced world, food has lost its <span className="text-[#ecab13] font-semibold">authenticity</span>. 
                Mass production has replaced love, chemicals have replaced nature, and convenience has replaced tradition.
              </p>
            </div>
          </div>

          {/* Traditional Methods Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-200">
            <h3 className="text-4xl font-bold text-[#2d6700] mb-8 text-center">
              Our Ancient Methods
            </h3>
            <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              We follow age-old techniques that have been perfected over generations, 
              ensuring every product carries the essence of traditional Indian cooking.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {[
                { method: 'Sun-drying', desc: 'Natural dehydration under golden sunlight' },
                { method: 'Slow roasting', desc: 'Patient roasting over controlled flames' },
                { method: 'Stone grinding', desc: 'Traditional stone mills preserve nutrients' },
                { method: 'Natural fermentation', desc: 'Time-tested fermentation processes' },
                { method: 'Cold-pressed oils', desc: 'Oils extracted without heat damage' }
              ].map((item, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-br from-[#2d6700]/10 to-[#ecab13]/10 rounded-2xl p-6 text-center hover:from-[#2d6700]/20 hover:to-[#ecab13]/20 transition-all duration-300 border border-[#2d6700]/20 hover:scale-105"
                >
                  <h4 className="font-bold text-[#2d6700] mb-3 text-lg">{item.method}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Love & Tradition Card */}
          <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-amber-200 text-center shadow-lg">
            <h3 className="text-4xl font-bold text-[#2d6700] mb-8">Made with Grandmother's Love</h3>
            <p className="text-2xl text-gray-700 leading-relaxed max-w-4xl mx-auto mb-8">
              Everything is made exactly the way our grandmothers cooked—with patience, 
              care, and an abundance of love. No shortcuts, no compromises, just 
              <span className="text-[#ecab13] font-bold"> pure authenticity</span>.
            </p>
          </div>

          {/* Call to Action */}
          <div className="text-center py-16">
            <h3 className="text-4xl font-bold text-[#2d6700] mb-8">
              Ready to taste tradition?
            </h3>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Experience the authentic flavors that have been passed down through generations
            </p>
            <div className="space-y-4 md:space-y-0 md:space-x-6 md:flex md:justify-center">
              <button
                onClick={() => window.navigateToProducts && window.navigateToProducts()}
                className="w-full md:w-auto bg-gradient-to-r from-[#2d6700] to-[#ecab13] text-white px-10 py-4 rounded-full text-xl font-semibold hover:from-[#ecab13] hover:to-[#2d6700] transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                Shop Our Products
              </button>
              <button
                onClick={() => window.navigateToStories && window.navigateToStories()}
                className="w-full md:w-auto bg-white text-[#2d6700] border-2 border-[#2d6700] px-10 py-4 rounded-full text-xl font-semibold hover:bg-[#2d6700] hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Read Our Stories
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-100/50 to-transparent"></div>
    </div>
  )
}

export default AboutPage