import { useState } from 'react';

const StoriesPage = ({ onBack }) => {
  const [selectedStory, setSelectedStory] = useState(null);

  const stories = [
    {
      id: 1,
      title: "Grandmother's Legacy",
      subtitle: "The Beginning of Janiitra",
      image: "/assets/grandmother-story.jpg",
      excerpt: "In the heart of Andhra Pradesh, a grandmother's secret recipes became the foundation of Janiitra...",
      content: `
        In the bustling kitchens of rural Andhra Pradesh, our story begins with Janiitra Amma, a woman whose hands carried the wisdom of generations. Every morning, as the sun painted the sky golden, she would rise to prepare pickles that would become legendary in her village.

        Her secret wasn't just in the ingredients – though she carefully selected the finest mangoes, the most aromatic mustard seeds, and the perfect red chilies. Her secret was in the love, patience, and traditional knowledge passed down through five generations of women in our family.

        "Pickles are not just food," she would say, "they are memories preserved in oil and spices." Each jar she prepared carried stories of festivals, celebrations, and the simple joy of sharing a meal with loved ones.

        This legacy of authentic taste and traditional methods became the cornerstone of what we now know as Janiitra Pickles. Every recipe we use today still follows her handwritten notes, carefully preserved and cherished.
      `,
      category: "Heritage"
    },
    {
      id: 2,
      title: "The Mango Chronicles",
      subtitle: "From Tree to Table",
      image: "/assets/mango-story.jpg",
      excerpt: "The journey of our signature mango pickle begins in the orchards of Andhra Pradesh...",
      content: `
        The story of our mango pickle begins at dawn in the orchards of Andhra Pradesh, where our farmers have been cultivating the finest mangoes for decades. These aren't just any mangoes – they're carefully selected varieties that have been grown specifically for pickling.

        Our master picker, Raman garu, has been with us for over 20 years. He knows exactly when a mango is ready – not too ripe, not too raw, but at that perfect stage where it will absorb the spices and develop that distinctive tangy-sweet flavor that makes our pickles irresistible.

        The transformation happens in our traditional preparation rooms, where each mango is hand-cut into perfect pieces, mixed with secret spice blends, and aged in ceramic pots under controlled conditions. This process, which takes weeks, cannot be rushed or mechanized.

        What makes our mango pickle special is this patience – the willingness to wait for flavors to develop naturally, just as our ancestors did. In today's fast-paced world, we preserve the slow art of traditional pickle-making.
      `,
      category: "Process"
    },
    {
      id: 3,
      title: "Spices of Tradition",
      subtitle: "The Heart of Every Recipe",
      image: "/assets/spices-story.jpg",
      excerpt: "Each spice in our pickles tells a story of ancient trade routes and family secrets...",
      content: `
        Walk into our spice preparation area, and you'll be transported to ancient India. The air is thick with the aroma of fenugreek, mustard seeds, red chilies, and turmeric – spices that have been the backbone of Indian cuisine for thousands of years.

        Our spice master, Lakshmi akka, sources these treasures from specific regions across India. The red chilies come from Guntur, known for their perfect balance of heat and flavor. The mustard seeds are from the fields of Punjab, where the soil gives them a distinctive pungency.

        But sourcing is just the beginning. Each spice is roasted to perfection, ground in small batches, and mixed according to proportions that have been refined over generations. The tempering process – where spices are heated in oil to release their essential oils – is an art form that requires years to master.

        What many don't realize is that our spice blends change slightly with the seasons, adjusting for the natural variations in moisture, temperature, and the inherent character of each spice harvest. This attention to detail ensures that every jar of Janiitra pickle maintains its authentic taste year-round.
      `,
      category: "Ingredients"
    },
    {
      id: 4,
      title: "Festival Memories",
      subtitle: "Pickles in Indian Celebrations",
      image: "/assets/festival-story.jpg",
      excerpt: "No Indian festival is complete without the tangy burst of homemade pickles...",
      content: `
        In Indian households, festivals and pickles are inseparably linked. During Ugadi, the Telugu New Year, our founder's grandmother would prepare special batches of mango pickle that would last the entire year. The preparation itself was a celebration – women from the neighborhood would gather, sharing stories and techniques while their hands worked in perfect rhythm.

        Diwali brought its own pickle traditions. Mixed vegetable pickles, made with the season's fresh produce, would be prepared as offerings to the gods and shared with visitors. The belief was that pickles, with their long shelf life, symbolized prosperity and abundance that would last throughout the year.

        During wedding seasons, our pickles became gifts of love. Families would send jars of homemade pickles to their daughters' new homes, ensuring that a taste of maternal love would always be present at the dining table.

        Today, when customers tell us that our pickles taste "just like my grandmother's," we know we're preserving more than just recipes – we're keeping alive the traditions that make Indian cuisine so rich and meaningful.
      `,
      category: "Culture"
    },
    {
      id: 5,
      title: "The Modern Journey",
      subtitle: "Tradition Meets Innovation",
      image: "/assets/modern-story.jpg",
      excerpt: "How we brought ancient recipes to modern kitchens without losing their soul...",
      content: `
        The journey from a small kitchen in Andhra Pradesh to homes across India wasn't easy. When we decided to share our family recipes with the world, we faced a challenge: how do you scale traditional pickle-making without losing its essence?

        Our solution was revolutionary yet simple – we refused to compromise. While other brands moved to industrial processes, we invested in expanding our traditional methods. Instead of one grandmother, we now have a team of skilled artisans, each trained in the exact techniques passed down through generations.

        We introduced modern hygiene standards and quality controls, but the core process remained unchanged. Mangoes are still hand-cut, spices are still roasted in small batches, and every jar is still aged naturally. The only difference is that we can now share these authentic flavors with thousands of families.

        Our packaging evolved too. We moved from traditional ceramic pots to modern, food-safe containers that preserve freshness without compromising taste. The result? Pickles that taste exactly like homemade, but with the convenience and safety that modern families deserve.

        Today, Janiitra Pickles bridges the gap between tradition and modernity, ensuring that authentic Indian flavors continue to enrich dining tables across the country.
      `,
      category: "Innovation"
    },
    {
      id: 6,
      title: "Health & Wellness",
      subtitle: "The Nutritional Legacy",
      image: "/assets/health-story.jpg",
      excerpt: "Ancient wisdom recognized pickles as more than just taste enhancers...",
      content: `
        Long before modern nutrition science, our ancestors understood the health benefits of fermented foods. Pickles weren't just about preserving seasonal vegetables – they were about preserving health and vitality.

        Traditional Indian pickles are powerhouses of probiotics, essential for digestive health. The fermentation process creates beneficial bacteria that aid in digestion and boost immunity. The spices used – turmeric, fenugreek, mustard seeds – each have their own medicinal properties recognized by Ayurveda.

        Our preparation methods honor this wellness tradition. We use cold-pressed oils that retain their nutritional value, natural salt that provides essential minerals, and traditional fermentation techniques that maximize probiotic content.

        What's remarkable is how this ancient wisdom aligns with modern nutritional science. Research now confirms what our grandmothers always knew – that pickles, when made traditionally with quality ingredients, are not just delicious but genuinely beneficial for health.

        At Janiitra, we're proud to continue this tradition of healthy eating, proving that authentic flavors and nutritional benefits can coexist beautifully.
      `,
      category: "Wellness"
    }
  ];

  const categories = ["All", "Heritage", "Process", "Ingredients", "Culture", "Innovation", "Wellness"];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredStories = activeCategory === "All" 
    ? stories 
    : stories.filter(story => story.category === activeCategory);

  const openStoryModal = (story) => {
    setSelectedStory(story);
    document.body.style.overflow = 'hidden';
  };

  const closeStoryModal = () => {
    setSelectedStory(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f7f6] to-[#f1f0ef]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#2d6700] to-[#3d8b00] text-white py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white hover:text-[#ecab13] transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </button>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold">Our Stories</h1>
              <p className="text-lg text-green-100 mt-2">Tales of Tradition, Taste & Heritage</p>
            </div>
            <div className="w-24"></div> {/* Spacer for alignment */}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#2d6700] mb-6">
            Every Jar Tells a Story
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            From grandmother's kitchen to your dining table, discover the rich heritage, 
            traditional methods, and passionate craftsmanship behind every Janiitra pickle.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-[#ecab13] text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stories Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStories.map((story, index) => (
              <div
                key={story.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="h-48 bg-gradient-to-br from-[#ecab13] to-[#d4941a] flex items-center justify-center">
                  <div className="text-6xl text-white">📖</div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 bg-[#ecab13]/10 text-[#d4941a] rounded-full text-sm font-medium">
                      {story.category}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#2d6700] mb-2">{story.title}</h3>
                  <p className="text-[#ecab13] font-medium mb-3">{story.subtitle}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{story.excerpt}</p>
                  
                  <button
                    onClick={() => openStoryModal(story)}
                    className="w-full bg-gradient-to-r from-[#2d6700] to-[#3d8b00] text-white py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    Read Full Story
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-hidden relative">
            <button
              onClick={closeStoryModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="overflow-y-auto max-h-[90vh]">
              <div className="h-64 bg-gradient-to-br from-[#ecab13] to-[#d4941a] flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="text-8xl mb-4">📖</div>
                  <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium">
                    {selectedStory.category}
                  </span>
                </div>
              </div>
              
              <div className="p-8">
                <h2 className="text-3xl font-bold text-[#2d6700] mb-2">{selectedStory.title}</h2>
                <p className="text-xl text-[#ecab13] font-medium mb-6">{selectedStory.subtitle}</p>
                
                <div className="prose prose-lg max-w-none">
                  {selectedStory.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-700 leading-relaxed mb-4">
                      {paragraph.trim()}
                    </p>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <button
                    onClick={closeStoryModal}
                    className="bg-gradient-to-r from-[#2d6700] to-[#3d8b00] text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    Close Story
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-16 px-4 bg-gradient-to-r from-[#2d6700] to-[#3d8b00] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Taste the Stories Yourself
          </h2>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Every jar of Janiitra pickle carries these stories of tradition, passion, and authentic flavors. 
            Experience the heritage that has been passed down through generations.
          </p>
          <button
            onClick={() => window.navigateToProducts && window.navigateToProducts()}
            className="bg-[#ecab13] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#d4941a] transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Shop Our Collection
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#f8f7f6] py-8 px-4 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p>&copy; 2025 Janiitra Pickles. All rights reserved.</p>
          <p className="mt-2">Preserving traditions, one jar at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default StoriesPage;