import { useState, useEffect } from 'react';

const WhatsAppChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const whatsappNumber = '7780197494';

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const encodedMessage = encodeURIComponent(message.trim());
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      window.open(whatsappURL, '_blank');
      setMessage('');
      closeChat();
    }
  };

  const quickMessages = [
    "Hi! I'm interested in your pickles 🥒",
    "What are your delivery options? 🚚",
    "Can you help me with product information? 📦",
    "I have a question about my order 🛒"
  ];

  const handleQuickMessage = (quickMsg) => {
    const encodedMessage = encodeURIComponent(quickMsg);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');
    closeChat();
  };

  const openChat = () => {
    setIsAnimating(true);
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsAnimating(false);
    setTimeout(() => setIsOpen(false), 300); // Match the animation duration
  };

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest('.whatsapp-chat-container')) {
        closeChat();
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <>
      {/* WhatsApp Toggle Button */}
      <button
        onClick={isOpen ? closeChat : openChat}
        className={`whatsapp-toggle-btn fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-110 ${
          !isOpen ? 'animate-bounce' : 'rotate-45'
        } ${isOpen ? 'bg-red-500 hover:bg-red-600' : ''}`}
        aria-label={isOpen ? "Close WhatsApp Chat" : "Open WhatsApp Chat"}
        title={isOpen ? "Close Chat" : "Chat with us on WhatsApp"}
      >
        {isOpen ? (
          // Close Icon
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            className="w-7 h-7 transition-transform duration-300"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          // WhatsApp Icon
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            className="w-7 h-7 transition-transform duration-300"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
          </svg>
        )}
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div 
          className={`whatsapp-chat-container fixed bottom-24 right-3 sm:right-6 z-50 w-[95vw] max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 transform transition-all duration-300 ${
            isAnimating 
              ? 'translate-y-0 opacity-100 scale-100' 
              : 'translate-y-full opacity-0 scale-95'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-t-2xl flex items-center justify-between relative overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 bg-white/5">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
            </div>
            
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-base">🥒 Janiitra Support</h3>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  <p className="text-sm opacity-90">Online • Replies instantly</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={closeChat}
              className="relative z-10 text-white/80 hover:text-white p-2 hover:bg-white/20 rounded-full transition-all duration-200"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {/* Welcome Message */}
            <div className="mb-4 animate-fade-in">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border-l-4 border-green-400">
                <div className="flex items-start gap-2 mb-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">J</div>
                  <div>
                    <p className="text-green-800 font-medium text-sm">👋 Hello! Welcome to Janiitra!</p>
                    <p className="text-green-700 text-xs mt-1">We're here to help with your pickle needs! How can we assist you today?</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Messages */}
            <div className="space-y-2 mb-4">
              <p className="text-xs font-medium text-gray-600 mb-3">💬 Quick Messages:</p>
              {quickMessages.map((quickMsg, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickMessage(quickMsg)}
                  className="w-full text-left p-3 bg-white hover:bg-green-50 rounded-lg text-sm text-gray-700 transition-all duration-200 border border-gray-200 hover:border-green-300 hover:shadow-md transform hover:scale-[1.02] animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="block font-medium">{quickMsg}</span>
                </button>
              ))}
            </div>

            {/* Custom Message Form */}
            <div className="border-t border-gray-200 pt-4">
              <form onSubmit={handleSendMessage} className="space-y-3">
                <div>
                  <label htmlFor="whatsapp-message" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                    ✏️ Or type your custom message:
                  </label>
                  <div className="relative">
                    <textarea
                      id="whatsapp-message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm transition-all duration-200"
                      rows="3"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                      {message.length}/500
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-all duration-200 text-sm flex items-center justify-center gap-2 transform hover:scale-[1.02] hover:shadow-lg"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
                  </svg>
                  🚀 Send to WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Animated Backdrop */}
      {isOpen && (
        <div 
          className={`fixed inset-0 z-40 transition-all duration-300 ${
            isAnimating ? 'bg-black/30' : 'bg-black/0'
          }`}
          onClick={closeChat}
        />
      )}
    </>
  );
};

export default WhatsAppChat;