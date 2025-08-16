import React, { useState, useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Button, Input, Label, Select, Textarea } from "@windmill/react-ui";
import { notifyError, notifySuccess } from "../../utils/toast";
import OrderServices from "../../services/OrderServices";
import UserServices from "../../services/UserServices";
import ProductServices from "../../services/ProductServices";
import Title from "../form/Title";
import LabelArea from "../form/LabelArea";

// Custom scrollbar styles
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:active {
    background: #64748b;
  }
  
  .dark .custom-scrollbar::-webkit-scrollbar-track {
    background: #374151;
  }
  
  .dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #6b7280;
    border: 1px solid #4b5563;
  }
  
  .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
  
  .dark .custom-scrollbar::-webkit-scrollbar-thumb:active {
    background: #d1d5db;
  }
`;

const OrderDrawer = ({ isOpen, onClose, orderData = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    userId: "",
    items: [{ 
      productId: "", 
      quantity: 1, 
      selectedVariation: "", 
      hasVariations: false,
      productSearch: "",
      variationSearch: "",
      showProductDropdown: false,
      showVariationDropdown: false
    }],
    paymentMethod: "Cash On Delivery",
    status: "Pending",
    notes: "",
  });

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load users and products on component mount
  useEffect(() => {
    loadUsers();
    loadProducts();
  }, []);

  // Handle clicking outside dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside any dropdown container
      const isOutsideProductDropdown = !event.target.closest('.product-dropdown-container');
      const isOutsideVariationDropdown = !event.target.closest('.variation-dropdown-container');
      
      // Close dropdowns when clicking outside their respective containers
      setFormData(prev => ({
        ...prev,
        items: prev.items.map(item => ({
          ...item,
          showProductDropdown: isOutsideProductDropdown ? false : item.showProductDropdown,
          showVariationDropdown: isOutsideVariationDropdown ? false : item.showVariationDropdown
        }))
      }));
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setFormData(prev => ({
          ...prev,
          items: prev.items.map(item => ({
            ...item,
            showProductDropdown: false,
            showVariationDropdown: false
          }))
        }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Set form data when editing
  useEffect(() => {
    if (orderData && isOpen) {
      setIsEdit(true);
      setFormData({
        userId: orderData.userId || "",
        items: orderData.items || [{ 
          productId: "", 
          quantity: 1, 
          selectedVariation: "", 
          hasVariations: false,
          productSearch: "",
          variationSearch: "",
          showProductDropdown: false,
          showVariationDropdown: false
        }],
        paymentMethod: orderData.paymentMethod || "Cash On Delivery",
        status: orderData.status || "Pending",
        notes: orderData.notes || "",
      });
    } else {
      setIsEdit(false);
      setFormData({
        userId: "",
        items: [{ 
          productId: "", 
          quantity: 1, 
          selectedVariation: "", 
          hasVariations: false,
          productSearch: "",
          variationSearch: "",
          showProductDropdown: false,
          showVariationDropdown: false
        }],
        paymentMethod: "Cash On Delivery",
        status: "Pending",
        notes: "",
      });
    }
  }, [orderData, isOpen]);

  const checkProductVariations = (productId) => {
    console.log("🔍 Checking variations for product ID:", productId, "Type:", typeof productId);
    const product = products.find(p => p.id === parseInt(productId) || p.id === productId);
    console.log("🔍 Found product:", product);
    
    if (product && product.variations) {
      let variations;
      
      // Check if variations is a JSON string and parse it
      if (typeof product.variations === 'string') {
        try {
          variations = JSON.parse(product.variations);
          console.log("🔍 Parsed variations from JSON:", variations);
        } catch (error) {
          console.error("🔍 Error parsing variations JSON:", error);
          variations = [];
        }
      } else {
        variations = product.variations;
        console.log("🔍 Variations (not JSON):", variations);
      }
      
      if (Array.isArray(variations) && variations.length > 0) {
        console.log("🔍 Product has variations:", variations.length);
        return true;
      }
    }
    
    console.log("🔍 Product has no variations");
    return false;
  };

  const getProductVariations = (productId) => {
    const product = products.find(p => p.id === parseInt(productId) || p.id === productId);
    if (product && product.variations) {
      let variations;
      
      // Check if variations is a JSON string and parse it
      if (typeof product.variations === 'string') {
        try {
          variations = JSON.parse(product.variations);
        } catch (error) {
          console.error("🔍 Error parsing variations JSON:", error);
          variations = [];
        }
      } else {
        variations = product.variations;
      }
      
      if (Array.isArray(variations)) {
        return variations;
      }
    }
    return [];
  };

  const getProductPrice = (item) => {
    if (item.selectedVariation && item.hasVariations) {
      // Get price from selected variation
      const product = products.find(p => p.id === parseInt(item.productId) || p.id === item.productId);
      if (product && product.variations) {
        let variations;
        
        // Parse variations if it's a JSON string
        if (typeof product.variations === 'string') {
          try {
            variations = JSON.parse(product.variations);
          } catch (error) {
            console.error("🔍 Error parsing variations JSON:", error);
            variations = [];
          }
        } else {
          variations = product.variations;
        }
        
        if (Array.isArray(variations)) {
          const variation = variations.find(v => v.size === item.selectedVariation);
          if (variation) {
            return variation.price || variation.promo_price_pkr || 0;
          }
        }
      }
    } else if (item.productId) {
      // Get price from main product
      const product = products.find(p => p.id === parseInt(item.productId) || p.id === item.productId);
      if (product) {
        return product.price || product.promo_price_pkr || 0;
      }
    }
    return 0;
  };

  const calculateTotalPrice = () => {
    let total = 0;
    formData.items.forEach(item => {
      if (item.productId) {
        const price = getProductPrice(item);
        total += price * item.quantity;
      }
    });
    return total;
  };

  const loadUsers = async () => {
    try {
      const response = await UserServices.getAllUsers();
      if (response && response.users) {
        // Filter only customers (role = 'customer')
        const customers = response.users.filter(user => user.role === 'customer');
        setUsers(customers);
      } else if (Array.isArray(response)) {
        const customers = response.filter(user => user.role === 'customer');
        setUsers(customers);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await ProductServices.getAllProducts();
      
      if (response && response.products) {
        setProducts(response.products);
      }
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    
    if (field === "productId") {
      // When product changes, check if it has variations
      const hasVariations = checkProductVariations(value);
      const selectedProduct = products.find(p => p.id === parseInt(value) || p.id === value);
      
      console.log("🔍 Product selected:", selectedProduct);
      console.log("🔍 Has variations:", hasVariations);
      console.log("🔍 Product variations data:", selectedProduct?.variations);
      
      newItems[index] = {
        ...newItems[index],
        productId: value,
        selectedVariation: "", // Reset variation when product changes
        hasVariations: hasVariations,
        productSearch: selectedProduct ? (selectedProduct.title || selectedProduct.name) : "",
        variationSearch: "", // Reset variation search
        showProductDropdown: false, // Close product dropdown
        showVariationDropdown: false // Close variation dropdown
      };
      
      console.log("🔍 Updated item:", newItems[index]);
    } else if (field === "selectedVariation") {
      // When variation changes, update search text
      newItems[index] = {
        ...newItems[index],
        selectedVariation: value,
        variationSearch: value,
        showVariationDropdown: false // Close variation dropdown
      };
    } else {
      newItems[index] = {
        ...newItems[index],
        [field]: value
      };
    }
    
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { 
        productId: "", 
        quantity: 1, 
        selectedVariation: "", 
        hasVariations: false,
        productSearch: "",
        variationSearch: "",
        showProductDropdown: false,
        showVariationDropdown: false
      }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        items: newItems
      }));
    }
  };

  const resetForm = () => {
    setFormData({
      userId: "",
      items: [{ 
        productId: "", 
        quantity: 1, 
        selectedVariation: "", 
        hasVariations: false,
        productSearch: "",
        variationSearch: "",
        showProductDropdown: false,
        showVariationDropdown: false
      }],
      paymentMethod: "Cash On Delivery",
      status: "Pending",
      notes: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.userId) {
      notifyError("Please select a customer");
      return;
    }

    if (formData.items.length === 0 || !formData.items[0].productId) {
      notifyError("Please add at least one product");
      return;
    }

    // Validate variations for products that have them
    for (let item of formData.items) {
      if (item.productId && item.hasVariations && !item.selectedVariation) {
        notifyError("Please select a variation for products that have variations");
        return;
      }
    }

    setLoading(true);
    try {
      const orderPayload = {
        ...formData,
        totalPrice: calculateTotalPrice(),
        items: formData.items.filter(item => item.productId),
        // Receiver details will be populated from selected customer data
        reciever_name: users.find(u => u.id === parseInt(formData.userId))?.name || "",
        reciever_address: users.find(u => u.id === parseInt(formData.userId))?.address || "",
        reciever_contact: users.find(u => u.id === parseInt(formData.userId))?.phone || "",
      };

      let response;
      if (isEdit) {
        response = await OrderServices.updateOrder(orderData.id, orderPayload);
        notifySuccess("Order updated successfully!");
      } else {
        response = await OrderServices.createOrder(orderPayload);
        notifySuccess("Order created successfully!");
      }

      if (response) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error saving order:", error);
      notifyError("Error saving order");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{scrollbarStyles}</style>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <Title
          title={isEdit ? "Update Order" : "Add New Order"}
          description={isEdit ? "Update your order and necessary information from here" : "Add your order and necessary information from here"}
        />
      </div>

      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit}>
          <div className="p-6 flex-grow scrollbar-hide w-full max-h-full pb-40">
            <div className="space-y-6">
              {/* User Selection */}
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Customer" />
                <div className="col-span-8 sm:col-span-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Select Customer
                    </div>
                    <Select
                      value={formData.userId}
                      onChange={(e) => handleInputChange("userId", e.target.value)}
                      className="border-2 border-gray-200 h-12 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-lg transition-all duration-200"
                      required
                    >
                      <option value="">Choose a customer</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} - {user.email} (Customer)
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Payment Method" />
                <div className="col-span-8 sm:col-span-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Payment Method
                    </div>
                    <Select
                      value={formData.paymentMethod}
                      onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                      className="border-2 border-gray-200 h-12 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent block w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-lg transition-all duration-200"
                      required
                    >
                      <option value="Cash On Delivery">Cash On Delivery</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="PayPal">PayPal</option>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Status" />
                <div className="col-span-8 sm:col-span-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Order Status
                    </div>
                    <Select
                      value={formData.status}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                      className="border-2 border-gray-200 h-12 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent block w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-lg transition-all duration-200"
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Order Items" />
                <div className="col-span-8 sm:col-span-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <span className="text-lg font-semibold text-gray-800 dark:text-white">Products</span>
                      <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full dark:bg-blue-900 dark:text-blue-200">
                        {formData.items.filter(item => item.productId).length} selected
                      </span>
                    </div>
                    <Button
                      size="small"
                      onClick={addItem}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Item
                    </Button>
                  </div>

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
                                    console.log("Main input onChange:", e.target.value);
                                    // Update search text directly
                                    const newItems = [...formData.items];
                                    newItems[index] = {
                                      ...newItems[index],
                                      productSearch: e.target.value
                                    };
                                    setFormData(prev => ({
                                      ...prev,
                                      items: newItems
                                    }));
                                  }}
                                  onClick={() => {
                                    // Ensure dropdown stays open when clicking on input
                                    if (!item.showProductDropdown) {
                                      handleItemChange(index, "showProductDropdown", true);
                                    }
                                  }}
                                  onFocus={() => {
                                    console.log("Main input focused");
                                    // Only open dropdown if it's not already open
                                    if (!item.showProductDropdown) {
                                      handleItemChange(index, "showProductDropdown", true);
                                    }
                                  }}
                                  onBlur={() => {
                                    console.log("Main input blurred");
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
                                      setFormData(prev => ({
                                        ...prev,
                                        items: newItems
                                      }));
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
                                            // Update all fields in a single state update
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
                                            
                                            setFormData(prev => ({
                                              ...prev,
                                              items: newItems
                                            }));
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
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, "quantity", parseInt(e.target.value))}
                              className="border-2 border-gray-200 h-12 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent block w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-lg transition-all duration-200"
                              required
                            />
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
                                    // Update search text directly
                                    const newItems = [...formData.items];
                                    newItems[index] = {
                                      ...newItems[index],
                                      variationSearch: e.target.value
                                    };
                                    setFormData(prev => ({
                                      ...prev,
                                      items: newItems
                                    }));
                                  }}
                                  onClick={() => {
                                    // Ensure dropdown stays open when clicking on input
                                    if (!item.showVariationDropdown) {
                                      handleItemChange(index, "showVariationDropdown", true);
                                    }
                                  }}
                                  onFocus={() => {
                                    // Only open dropdown if it's not already open
                                    if (!item.showVariationDropdown) {
                                      handleItemChange(index, "showVariationDropdown", true);
                                    }
                                  }}
                                  style={{ zIndex: 1 }}
                                  disabled={false}
                                  readOnly={false}
                                  autoComplete="off"
                                />
                                {/* Search Icon */}
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                  </svg>
                                </div>
                                
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
                                      setFormData(prev => ({
                                        ...prev,
                                        items: newItems
                                      }));
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
                                              // Update all variation fields in a single state update
                                              const newItems = [...formData.items];
                                              newItems[index] = {
                                                ...newItems[index],
                                                selectedVariation: variation.size,
                                                variationSearch: variation.size,
                                                showVariationDropdown: false
                                              };
                                              
                                              console.log("🔍 Variation selected:", variation.size);
                                              console.log("🔍 Updated item:", newItems[index]);
                                              
                                              setFormData(prev => ({
                                                ...prev,
                                                items: newItems
                                              }));
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
                            <div className="flex items-end justify-end"> {/* Remove button in variation row */}
                              <Button
                                size="small"
                                onClick={() => removeItem(index)}
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

                        {/* Debug info - Remove this after testing */}
                        <div className="text-xs text-gray-500 dark:text-gray-400 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                          Debug: Product ID: {item.productId} | Has Variations: {item.hasVariations ? 'Yes' : 'No'} | 
                          Variations Count: {item.productId ? getProductVariations(item.productId).length : 0} |
                          Selected Variation: {item.selectedVariation || 'None'} |
                          Variation Search: {item.variationSearch || 'Empty'}
                        </div>

                        {/* Remove button row - Only show when no variations */}
                        {!item.hasVariations && (
                          <div className="flex justify-end">
                            <Button
                              size="small"
                              onClick={() => removeItem(index)}
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
                              Price per unit: ${getProductPrice(item)}
                            </span>
                            <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
                              Total: ${(getProductPrice(item) * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Total Price */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-lg font-semibold text-green-800 dark:text-green-200">Order Summary</span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                          ${calculateTotalPrice().toFixed(2)}
                        </div>
                        <div className="text-sm text-green-600 dark:text-green-400">
                          {formData.items.filter(item => item.productId).length} item(s)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
                <LabelArea label="Notes" />
                <div className="col-span-8 sm:col-span-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                      <svg className="w-4 h-4 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Additional Notes
                    </div>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      className="border-2 border-gray-200 h-12 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent block w-full bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white rounded-lg transition-all duration-200"
                      placeholder="Additional notes"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  size="small"
                  layout="outline"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Reset
                </Button>
                <Button
                  size="small"
                  layout="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="small"
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {loading ? "Saving..." : (isEdit ? "Update Order" : "Create Order")}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </Scrollbars>
    </>
  );
};

export default OrderDrawer; 