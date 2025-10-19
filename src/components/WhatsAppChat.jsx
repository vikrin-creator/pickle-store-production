import { useState } from 'react';

const WhatsAppChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const whatsappNumber = '7780197494';

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const encodedMessage = encodeURIComponent(message.trim());
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      window.open(whatsappURL, '_blank');
      setMessage('');
      setIsOpen(false);
    }
  };

  const quickMessages = [
    "Hi! I'm interested in your pickles",
    "What are your delivery options?",
    "Can you help me with product information?",
    "I have a question about my order"
  ];

  const handleQuickMessage = (quickMsg) => {
    const encodedMessage = encodeURIComponent(quickMsg);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
    setIsOpen(false);
  };

  return (
    <>
      {/* WhatsApp Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 ${!isOpen ? 'animate-pulse' : ''}`}
        aria-label="Open WhatsApp Chat"
        title="Chat with us on WhatsApp"
      >
        <svg 
          width="28" 
          height="28" 
          viewBox="0 0 24 24" 
          fill="currentColor"
          className="w-7 h-7"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
        </svg>
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 max-w-[calc(100vw-3rem)] sm:max-w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 animate-slide-up">
          {/* Header */}
          <div className="bg-green-500 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Janiitra Support</h3>
                <p className="text-xs opacity-90">Typically replies instantly</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4">
            <div className="mb-4">
              <div className="bg-gray-100 rounded-lg p-3 text-sm">
                <p className="text-gray-800 mb-2">👋 Hi there! Welcome to Janiitra!</p>
                <p className="text-gray-600 text-xs">How can we help you today? Choose a quick message or type your own:</p>
              </div>
            </div>

            {/* Quick Messages */}
            <div className="space-y-2 mb-4">
              {quickMessages.map((quickMsg, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickMessage(quickMsg)}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors border border-gray-200 hover:border-green-300"
                >
                  {quickMsg}
                </button>
              ))}
            </div>

            {/* Custom Message Form */}
            <form onSubmit={handleSendMessage} className="space-y-3">
              <div>
                <label htmlFor="whatsapp-message" className="block text-sm font-medium text-gray-700 mb-1">
                  Or type your message:
                </label>
                <textarea
                  id="whatsapp-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
                  rows="3"
                />
              </div>
              <button
                type="submit"
                disabled={!message.trim()}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 px-4 rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
                </svg>
                Send to WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default WhatsAppChat;