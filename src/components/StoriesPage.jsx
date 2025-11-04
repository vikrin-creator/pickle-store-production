import { useEffect } from 'react';
import Footer from './Footer';

const StoriesPage = ({ onBack }) => {
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


  const stories = [
    {
      id: 1,
      title: "Grandmother's Legacy",
      subtitle: "The Beginning of Janiitra",
      image: "/assets/Grandma.png",
      excerpt: "In the heart of Andhra Pradesh, a grandmother's secret recipes became the foundation of Janiitra. Her hands carried the wisdom of five generations, turning simple ingredients into legendary pickles.",
      category: "Heritage"
    },
    {
      id: 2,
      title: "The Mango Chronicles",
      subtitle: "From Tree to Table",
      image: "assets/MangoChronicles.jpg",
      excerpt: "The journey begins at dawn in Andhra Pradesh orchards, where our farmers cultivate the finest mangoes. Hand-picked at perfect ripeness, aged in ceramic pots for weeks.",
      category: "Process"
    },
    {
      id: 3,
      title: "Spices of Tradition",
      subtitle: "The Heart of Every Recipe",
      image: "assets/Spices.png",
      excerpt: "Each spice tells a story of ancient trade routes. Red chilies from Guntur, mustard seeds from Punjab, all roasted and ground in small batches to perfection.",
      category: "Ingredients"
    },
    {
      id: 4,
      title: "Festival Memories",
      subtitle: "Pickles in Indian Celebrations",
      image: "assets/Festival.png",
      excerpt: "During Ugadi and Diwali, pickles symbolize prosperity and abundance. Women gather, sharing stories and techniques while creating jars of love and tradition.",
      category: "Culture"
    },
    {
      id: 5,
      title: "The Modern Journey",
      subtitle: "Tradition Meets Innovation",
      image: "assets/ModernJourney.png",
      excerpt: "From a small kitchen to homes across India, we scale traditional methods without compromise. Modern hygiene meets ancestral recipes.",
      category: "Innovation"
    },
    {
      id: 6,
      title: "Health & Wellness",
      subtitle: "The Nutritional Legacy",
      image: "https://images.unsplash.com/photo-1599810232-ffd5db63a4d1?w=800&h=600&fit=crop",
      excerpt: "Ancient wisdom meets modern science. Our pickles are powerhouses of probiotics, with spices offering medicinal benefits recognized by Ayurveda.",
      category: "Wellness"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#2d6700] bg-opacity-90 border-b border-[#ecab13]/20 shadow-sm backdrop-blur-fallback">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <img 
              src="/assets/logo.png"
              alt="Janiitra Logo"
              className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => window.navigateToHome && window.navigateToHome()}
            />

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => window.navigateToHome && window.navigateToHome()}
                className="text-sm font-medium text-white hover:text-[#ecab13] transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => window.navigateToProducts && window.navigateToProducts()}
                className="text-sm font-medium text-white hover:text-[#ecab13] transition-colors"
              >
                Shop
              </button>
              <span className="text-sm font-semibold text-[#ecab13]">Stories</span>
              <button 
                onClick={() => window.navigateToContact && window.navigateToContact()}
                className="text-sm font-medium text-white hover:text-[#ecab13] transition-colors"
              >
                Contact
              </button>
            </nav>

            {/* Back Button */}
            <button
              onClick={() => window.navigateToHome && window.navigateToHome()}
              className="flex items-center gap-2 text-white hover:text-[#ecab13] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>
        </div>
      </header>

      {/* Magazine Header */}
      <div 
        className="relative h-[400px] md:h-[500px] flex flex-col items-center justify-center text-center px-4"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.45) 100%), url("/assets/story_bg.png")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-white mb-4" style={{ textShadow: '2px 2px 8px rgba(0, 0, 0, 0.6)' }}>
            From Our Family Kitchen to Your Table
          </h1>
          <p className="text-base md:text-lg lg:text-xl font-normal leading-normal text-white max-w-2xl mx-auto" style={{ textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)' }}>
            Discover the journey of a timeless recipe, crafted with love and tradition through generations
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Story (Magazine Style - Large) */}
        <div className="mb-12">
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative h-80 md:h-96">
                <img 
                  src={stories[0].image}
                  alt={stories[0].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-[#ecab13] text-white px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                    {stories[0].category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h3 className="text-sm font-semibold text-[#ecab13] uppercase tracking-wide mb-2">
                  Featured Story
                </h3>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {stories[0].title}
                </h2>
                <p className="text-lg text-[#2d6700] font-medium mb-4">
                  {stories[0].subtitle}
                </p>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {stories[0].excerpt}
                </p>
                <button
                  onClick={() => window.navigateToProducts && window.navigateToProducts()}
                  className="self-start bg-[#2d6700] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1f4800] transition-colors duration-300"
                >
                  Explore Our Pickles
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Story Sections - Alternating Layout like code.html */}
        <div className="space-y-20 md:space-y-32">
          {stories.slice(1).map((story, index) => (
            <div 
              key={story.id}
              className={`grid md:grid-cols-2 gap-12 items-center ${
                index % 2 === 0 ? '' : 'md:grid-flow-dense'
              }`}
            >
              {/* Image */}
              <div className={`${index % 2 === 0 ? '' : 'md:col-start-2'}`}>
                <div className="relative">
                  <img 
                    src={story.image}
                    alt={story.title}
                    className="w-full h-64 md:h-80 rounded-xl shadow-2xl object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#ecab13] text-white px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                      {story.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className={`${index % 2 === 0 ? '' : 'md:col-start-1'}`}>
                <h3 className="text-4xl font-bold text-[#2d6700] mb-4">{story.title}</h3>
                <div className="h-1 w-20 bg-[#ecab13] mb-6"></div>
                <p className="text-lg font-medium text-[#ecab13] mb-4">{story.subtitle}</p>
                <p className="text-lg leading-relaxed text-gray-700">
                  {story.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="mt-16 bg-gradient-to-r from-[#ecab13] to-[#d4941a] rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Experience the Legacy</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Every jar tells a story. Every taste brings back memories. 
            Discover authentic Indian pickles crafted with love and tradition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.navigateToProducts && window.navigateToProducts()}
              className="bg-white text-[#2d6700] px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              Shop Collection
            </button>
            <button
              onClick={() => window.navigateToHome && window.navigateToHome()}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default StoriesPage;