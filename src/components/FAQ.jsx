import { useState, useEffect } from 'react';

const FAQ = ({ isOpen, onClose, faqs = [] }) => {
  const [openFaq, setOpenFaq] = useState(null);
  const [faqCategories, setFaqCategories] = useState({
    General: [],
    Products: [],
    Shipping: [],
    Returns: [],
    Payment: []
  });

  useEffect(() => {
    // Group FAQs by category
    const categorized = {
      General: [],
      Products: [],
      Shipping: [],
      Returns: [],
      Payment: []
    };

    faqs.forEach(faq => {
      if (categorized[faq.category]) {
        categorized[faq.category].push(faq);
      } else {
        categorized.General.push(faq);
      }
    });

    setFaqCategories(categorized);
  }, [faqs]);

  const toggleFaq = (faqId) => {
    setOpenFaq(openFaq === faqId ? null : faqId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-lg shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">❓ Frequently Asked Questions</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors relative z-20"
              aria-label="Close FAQ modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 mt-2">Find answers to commonly asked questions about our products and services.</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {faqs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤔</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs Available</h3>
              <p className="text-gray-600">We're working on adding helpful questions and answers. Please check back soon!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(faqCategories).map(([category, categoryFaqs]) => {
                if (categoryFaqs.length === 0) return null;

                return (
                  <div key={category} className="space-y-4">
                    {/* Category Header */}
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
                      <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full mr-3 ${
                        category === 'General' ? 'bg-blue-100 text-blue-800' :
                        category === 'Products' ? 'bg-green-100 text-green-800' :
                        category === 'Shipping' ? 'bg-purple-100 text-purple-800' :
                        category === 'Returns' ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {category}
                      </span>
                      ({categoryFaqs.length} {categoryFaqs.length === 1 ? 'question' : 'questions'})
                    </h3>

                    {/* FAQ Items */}
                    <div className="space-y-3">
                      {categoryFaqs.map((faq) => (
                        <div key={faq._id || faq.id} className="border border-gray-200 rounded-lg">
                          <button
                            onClick={() => toggleFaq(faq._id || faq.id)}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
                          >
                            <div className="flex justify-between items-center">
                              <h4 className="font-medium text-gray-900 pr-4">{faq.question}</h4>
                              <svg
                                className={`w-5 h-5 text-gray-500 transform transition-transform ${
                                  openFaq === (faq._id || faq.id) ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </button>
                          
                          {openFaq === (faq._id || faq.id) && (
                            <div className="px-4 pb-3 text-gray-600">
                              <div className="pt-2 border-t border-gray-100">
                                <p className="whitespace-pre-wrap">{faq.answer}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 text-center">
          <p className="text-sm text-gray-600">
            Can't find what you're looking for? 
            <a href="#" className="text-orange-600 hover:text-orange-700 ml-1">Contact our support team</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;