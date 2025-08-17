import React from "react";

const OrderSummary = ({ formData, products, getProductPrice, calculateTotalPrice }) => {
  return (
    <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
      <div className="col-span-6">
        {/* Order Summary Header */}
        <div className="mb-4">
          <div className="flex items-center">
            <span className="text-lg font-semibold text-gray-800 dark:text-white">Order Summary</span>
            <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full dark:bg-green-900 dark:text-green-200">
              {formData.items.filter(item => item.productId).length} item(s)
            </span>
          </div>
        </div>

        {/* Enhanced Order Summary - Invoice Style */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 via-fuchsia-600 to-yellow-400 px-6 py-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg className="w-7 h-7 text-yellow-200 drop-shadow-lg mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <defs>
                    <radialGradient id="orderHeaderGlow" cx="50%" cy="50%" r="80%">
                      <stop offset="0%" stopColor="#fffbe6" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </radialGradient>
                  </defs>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" style={{stroke: "url(#orderHeaderGlow)"}} />
                </svg>
                <h3 className="text-xl font-extrabold text-white tracking-wide drop-shadow-glow animate-pulse">Order Details</h3>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-yellow-100">Total Amount</div>
                <div className="text-3xl font-extrabold text-white drop-shadow-glow">Rs.{(typeof calculateTotalPrice() === 'number' ? calculateTotalPrice() : 0).toFixed(2)}</div>
              </div>
            </div>
          </div>

          {/* Itemized Breakdown */}
          <div className="overflow-x-auto">
            <div className="p-6 min-w-max">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 pb-3 border-b-2 border-gray-200 dark:border-gray-600 mb-4">
                <div className="col-span-5">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Product Details</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Variation</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Quantity</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Unit Price</span>
                </div>
                <div className="col-span-1 text-right">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total</span>
                </div>
              </div>

              {/* Items */}
              {formData.items.filter(item => item.productId).map((item, index) => {
                const product = products.find(p => p.id === parseInt(item.productId) || p.id === item.productId);
                const unitPrice = getProductPrice(item) || 0;
                const itemTotal = (unitPrice || 0) * (item.quantity || 1);
                
                // Ensure we have valid numbers
                const safeUnitPrice = typeof unitPrice === 'number' ? unitPrice : parseFloat(unitPrice) || 0;
                const safeItemTotal = typeof itemTotal === 'number' ? itemTotal : parseFloat(itemTotal) || 0;
                
                return (
                  <div key={index} className="grid grid-cols-12 gap-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                    <div className="col-span-5">
                      <div className="flex items-center">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white text-sm">
                            {product?.title || product?.name || 'Unknown Product'}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {item.productId}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {item.selectedVariation || 'Standard'}
                      </span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {safeUnitPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className="col-span-1 text-right">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {safeItemTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Summary Calculations */}
              <div className="mt-6 space-y-3">
                {/* Subtotal */}
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    Rs.{(typeof calculateTotalPrice() === 'number' ? calculateTotalPrice() : 0).toFixed(2)}
                  </span>
                </div>

                {/* Tax (if applicable) */}
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tax (0%)</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Rs.0.00</span>
                </div>

                {/* Shipping (if applicable) */}
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Shipping</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Rs.0.00</span>
                </div>

                {/* Discount (if applicable) */}
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Discount</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Rs.0.00</span>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-3">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    Rs.{(typeof calculateTotalPrice() === 'number' ? calculateTotalPrice() : 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary; 