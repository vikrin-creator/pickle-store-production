import { useState } from 'react';

const OrderConfirmation = ({ order, onContinueShopping }) => {
  return (
    <div className="min-h-screen bg-[#f8f7f6] font-sans text-[#221c10]">
      {/* Header */}
      <header className="w-full border-b border-[#ecab13]/20 bg-[#f8f7f6]">
        <div className="flex items-center justify-between px-4 sm:px-8 py-4">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <img 
              src="/assets/logo.png"
              alt="Janiitra Logo"
              className="h-6 w-36 sm:h-8 sm:w-48 object-contain"
            />
          </div>
          <h1 className="text-xl font-semibold">Order Confirmation</h1>
          <button
            onClick={onContinueShopping}
            className="text-[#221c10] hover:text-[#ecab13] transition-colors duration-200"
          >
            Continue Shopping
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">Order Placed Successfully!</h2>
          <p className="text-lg text-[#221c10]/80 mb-2">Thank you for your purchase!</p>
          <p className="text-[#221c10]/60">
            Your order <span className="font-semibold text-[#ecab13]">#{order.orderNumber || order.id}</span> has been confirmed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Order Details</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-[#221c10]/60">Order Number:</span>
                <span className="font-semibold">{order.orderNumber || order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#221c10]/60">Order Date:</span>
                <span className="font-semibold">
                  {new Date(order.createdAt || order.orderDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#221c10]/60">Status:</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {order.status || 'Confirmed'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#221c10]/60">Email:</span>
                <span className="font-semibold">{order.customerInfo.email}</span>
              </div>
            </div>

            <div className="border-t border-[#ecab13]/20 pt-6">
              <h4 className="font-semibold mb-4">Shipping Address</h4>
              <div className="text-[#221c10]/80 space-y-1">
                <p>{order.customerInfo.name}</p>
                <p>{order.customerInfo.address?.street || order.customerInfo.address}</p>
                <p>{order.customerInfo.address?.city || order.customerInfo.city}, {order.customerInfo.address?.state || order.customerInfo.state} {order.customerInfo.address?.pincode || order.customerInfo.zipCode}</p>
                <p>{order.customerInfo.country || 'India'}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-6">Order Items</h3>
            
            <div className="space-y-4 mb-6">
              {order.items.map((item, index) => (
                <div key={item.cartId || index} className="flex gap-4 pb-4 border-b border-gray-100 last:border-b-0">
                  <img
                    src={item.image || 'https://via.placeholder.com/64x64/ecab13/FFFFFF?text=' + encodeURIComponent(item.name)}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-[#221c10]/60 mb-2">{item.description}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                        {item.weight || item.selectedWeight?.weight || 'Standard'}
                      </span>
                      <span className="text-xs text-[#221c10]/60">
                        Qty: {item.quantity}
                      </span>
                    </div>
                    <div className="text-[#ecab13] font-semibold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#ecab13]/20 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">
                  ₹{(order.subtotal || order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-semibold">
                  ₹{(order.shipping || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (GST):</span>
                <span className="font-semibold">
                  ₹{(order.tax || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-[#ecab13] border-t pt-2">
                <span>Total:</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="mt-12 bg-[#ecab13]/10 rounded-xl p-6">
          <h3 className="text-xl font-semibold mb-4">What's Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#ecab13] rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2">Order Confirmed</h4>
              <p className="text-sm text-[#221c10]/60">We've received your order and will start processing it.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#ecab13]/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-[#ecab13]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2">Preparing</h4>
              <p className="text-sm text-[#221c10]/60">Your pickles are being carefully prepared and packaged.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#ecab13]/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-[#ecab13]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2">Delivery</h4>
              <p className="text-sm text-[#221c10]/60">You'll receive tracking info once your order ships.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onContinueShopping}
            className="bg-[#ecab13] text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity duration-200"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => window.print()}
            className="border-2 border-[#ecab13]/30 text-[#221c10] px-8 py-3 rounded-lg font-semibold hover:border-[#ecab13] hover:bg-[#ecab13]/5 transition-all duration-200"
          >
            Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;