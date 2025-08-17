import React from "react";
import { Button, Input, Label } from "@windmill/react-ui";

const OrderItems = ({
  formData,
  products,
  onItemChange,
  onAddItem,
  onRemoveItem,
  checkProductVariations,
  getProductVariations,
  getProductPrice,
  getProductStock,
  validateQuantity
}) => {
  return (
    <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
      <div className="col-span-6">
        <Label className="text-lg font-semibold text-gray-800 dark:text-white mb-2 block">
          Select Products
        </Label>

        {formData.items.map((item, index) => (
          <div key={index} className="border-2 border-gray-200 rounded-xl p-6 mb-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200" data-item-index={index}>
            <div className="space-y-4">
              {/* Product and Variation Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Product
                  </Label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="border-2 border-gray-200 h-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-lg transition-all duration-200 pr-12 pl-3"
                      value={item.productSearch || ""}
                      onChange={(e) => {
                        const newItems = [...formData.items];
                        newItems[index] = {
                          ...newItems[index],
                          productSearch: e.target.value
                        };
                        onItemChange("items", newItems);
                      }}
                      onClick={() => {
                        if (!item.showProductDropdown) {
                          const newItems = [...formData.items];
                          newItems[index] = {
                            ...newItems[index],
                            showProductDropdown: true
                          };
                          onItemChange("items", newItems);
                        }
                      }}
                      onFocus={() => {
                        if (!item.showProductDropdown) {
                          const newItems = [...formData.items];
                          newItems[index] = {
                            ...newItems[index],
                            showProductDropdown: true
                          };
                          onItemChange("items", newItems);
                        }
                      }}
                      style={{ zIndex: 1 }}
                      disabled={false}
                      readOnly={false}
                      autoComplete="off"
                    />

                    {/* Clear Button - Only show when there's text */}
                    {item.productSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          const newItems = [...formData.items];
                          newItems[index] = {
                            ...newItems[index],
                            productId: "",
                            selectedVariation: "",
                            hasVariations: false,
                            productSearch: "",
                            variationSearch: "",
                            showProductDropdown: false,
                            showVariationDropdown: false
                          };
                          onItemChange("items", newItems);
                        }}
                        className="absolute inset-y-0 right-3 flex items-center justify-center w-6 h-6 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-200"
                        title="Clear selection"
                        style={{ zIndex: 2 }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}

                    {item.showProductDropdown && (
                      <div
                        className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-96 overflow-hidden product-dropdown-container"
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <div
                          className="max-h-96 overflow-y-auto custom-scrollbar"
                          style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#d1d5db #f3f4f6',
                            maxHeight: '384px'
                          }}
                        >
                          {products
                            .filter(product =>
                              (product.title || product.name || "")
                                .toLowerCase()
                                .includes((item.productSearch || "").toLowerCase())
                            )
                            .map((product) => (
                              <div
                                key={product.id}
                                className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors duration-150"
                                onClick={() => {
                                  const newItems = [...formData.items];
                                  const hasVariations = checkProductVariations(product.id);

                                  newItems[index] = {
                                    ...newItems[index],
                                    productId: product.id,
                                    selectedVariation: "",
                                    hasVariations: hasVariations,
                                    productSearch: product.title || product.name,
                                    variationSearch: "",
                                    showProductDropdown: false,
                                    showVariationDropdown: false
                                  };

                                  onItemChange("items", newItems);
                                }}
                              >
                                {product.title || product.name}
                              </div>
                            ))}
                          {products.filter(product =>
                            (product.title || product.name || "")
                              .toLowerCase()
                              .includes((item.productSearch || "").toLowerCase())
                          ).length === 0 && (
                              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                                No products found
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Quantity
                  </Label>
                  <Input
                    type="number"
                    min="1"
                    max={item.productId ? getProductStock(item) : 999}
                    value={item.quantity}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value) || 1;
                      const availableStock = getProductStock(item);
                      
                      // Validate quantity against available stock
                      if (newQuantity > availableStock) {
                        // Don't allow exceeding stock
                        return;
                      }
                      
                      const newItems = [...formData.items];
                      newItems[index] = {
                        ...newItems[index],
                        quantity: newQuantity
                      };
                      onItemChange("items", newItems);
                    }}
                    className={`border-2 h-12 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent block w-full rounded-lg transition-all duration-200 ${
                      item.productId && item.quantity > getProductStock(item)
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-gray-200 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                    }`}
                    required
                  />
                  {/* Stock information */}
                  {item.productId && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.hasVariations && !item.selectedVariation ? (
                        <span>Total Variations Stock: {getProductStock(item)} units</span>
                      ) : item.hasVariations && item.selectedVariation ? (
                        <span>Selected Variation Stock: {getProductStock(item)} units</span>
                      ) : (
                        <span>Available: {getProductStock(item)} units</span>
                      )}
                      {item.quantity > getProductStock(item) && (
                        <span className="text-red-500 ml-2">⚠️ Exceeds available stock</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Variation Row - Only show if product has variations */}
              {item.hasVariations && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                      Variation
                    </Label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search variations..."
                        className="border-2 border-gray-200 h-12 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 block w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-lg transition-all duration-200 pr-12 pl-3"
                        value={item.variationSearch || ""}
                        onChange={(e) => {
                          const newItems = [...formData.items];
                          newItems[index] = {
                            ...newItems[index],
                            variationSearch: e.target.value
                          };
                          onItemChange("items", newItems);
                        }}
                        onClick={() => {
                          if (!item.showVariationDropdown) {
                            const newItems = [...formData.items];
                            newItems[index] = {
                              ...newItems[index],
                              showVariationDropdown: true
                            };
                            onItemChange("items", newItems);
                          }
                        }}
                        onFocus={() => {
                          if (!item.showVariationDropdown) {
                            const newItems = [...formData.items];
                            newItems[index] = {
                              ...newItems[index],
                              showVariationDropdown: true
                            };
                            onItemChange("items", newItems);
                          }
                        }}
                        style={{ zIndex: 1 }}
                        disabled={false}
                        readOnly={false}
                        autoComplete="off"
                      />

                      {/* Clear Button - Only show when there's text */}
                      {item.variationSearch && (
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = [...formData.items];
                            newItems[index] = {
                              ...newItems[index],
                              selectedVariation: "",
                              variationSearch: "",
                              showVariationDropdown: false
                            };
                            onItemChange("items", newItems);
                          }}
                          className="absolute inset-y-0 right-3 flex items-center justify-center w-6 h-6 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-200"
                          title="Clear variation"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}

                      {item.showVariationDropdown && (
                        <div
                          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-96 overflow-hidden variation-dropdown-container"
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <div
                            className="max-h-96 overflow-y-auto custom-scrollbar"
                            style={{
                              scrollbarWidth: 'thin',
                              scrollbarColor: '#d1d5db #f3f4f6',
                              maxHeight: '384px'
                            }}
                          >
                            {getProductVariations(item.productId)
                              .filter(variation =>
                                variation.size.toLowerCase().includes((item.variationSearch || "").toLowerCase())
                              )
                              .map((variation, idx) => (
                                <div
                                  key={idx}
                                  className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors duration-150"
                                  onClick={() => {
                                    const newItems = [...formData.items];
                                    newItems[index] = {
                                      ...newItems[index],
                                      selectedVariation: variation.size,
                                      variationSearch: variation.size,
                                      showVariationDropdown: false
                                    };

                                    onItemChange("items", newItems);
                                  }}
                                >
                                  {variation.size}
                                </div>
                              ))}
                            {getProductVariations(item.productId).filter(variation =>
                              variation.size.toLowerCase().includes((item.variationSearch || "").toLowerCase())
                            ).length === 0 && (
                                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                                  No variations found
                                </div>
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-end justify-end">
                    <Button
                      size="small"
                      onClick={() => onRemoveItem(index)}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-12 h-12 p-0 flex items-center justify-center"
                      disabled={formData.items.length === 1}
                      title="Remove Item"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </div>
              )}

              {/* Remove button row - Only show when no variations */}
              {!item.hasVariations && (
                <div className="flex justify-end">
                  <Button
                    size="small"
                    onClick={() => onRemoveItem(index)}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed w-12 h-12 p-0 flex items-center justify-center"
                    disabled={formData.items.length === 1}
                    title="Remove Item"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              )}
            </div>

            {/* Show selected product price */}
            {item.productId && (
              <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Price per unit: Rs. {getProductPrice(item)}
                  </span>
                  <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
                    Total: Rs. {(getProductPrice(item) * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-between items-center mb-4">
          <div className="flex justify-end w-full">
            <Button
              size="small"
              onClick={onAddItem}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Item
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderItems; 