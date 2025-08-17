import React, { useState, useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Button, Select, Textarea } from "@windmill/react-ui";
import { notifyError, notifySuccess } from "../../utils/toast";
import OrderServices from "../../services/OrderServices";
import UserServices from "../../services/UserServices";
import ProductServices from "../../services/ProductServices";
import Title from "../form/Title";
import LabelArea from "../form/LabelArea";
import OrderItems from "../order/OrderItems";
import OrderSummary from "../order/OrderSummary";

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

  // Refresh products data when drawer opens to get latest stock
  useEffect(() => {
    if (isOpen) {
      loadProducts();
    }
  }, [isOpen]);

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
      
      if (Array.isArray(variations) && variations.length > 0) {
        return true;
      }
    }
    
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
            // Priority: promo_price_pkr first, then price, then 0
            const price = variation.promo_price_pkr || variation.price || 0;
            return typeof price === 'number' ? price : parseFloat(price) || 0;
          }
        }
      }
    } else if (item.productId) {
      // Get price from main product
      const product = products.find(p => p.id === parseInt(item.productId) || p.id === item.productId);
      if (product) {
        // Priority: promo_price_pkr first, then price, then 0
        const price = product.promo_price_pkr || product.price || 0;
        return typeof price === 'number' ? price : parseFloat(price) || 0;
      }
    }
    return 0;
  };

  const getProductStock = (item) => {
    if (item.selectedVariation && item.hasVariations) {
      // Get stock from selected variation
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
            return parseInt(variation.stock) || 0;
          }
        }
      }
    } else if (item.productId) {
      // Get stock from main product or total variations stock
      const product = products.find(p => p.id === parseInt(item.productId) || p.id === item.productId);
      if (product) {
        if (item.hasVariations && product.variations) {
          // Calculate total stock from all variations
          let variations;
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
            const totalStock = variations.reduce((sum, variation) => {
              return sum + (parseInt(variation.stock) || 0);
            }, 0);
            return totalStock;
          }
        } else {
          // Regular product without variations
          return parseInt(product.stock) || 0;
        }
      }
    }
    return 0;
  };

  const validateQuantity = (item, newQuantity) => {
    const availableStock = getProductStock(item);
    return newQuantity <= availableStock;
  };

  const updateProductStock = (orderItems) => {
    // Update local products stock after order creation
    const updatedProducts = products.map(product => {
      const orderItem = orderItems.find(item => 
        item.productId === product.id || item.productId === product.id.toString()
      );
      
      if (orderItem) {
        if (orderItem.selectedVariation && product.variations) {
          // Update variation stock
          let variations;
          if (typeof product.variations === 'string') {
            try {
              variations = JSON.parse(product.variations);
            } catch (error) {
              variations = [];
            }
          } else {
            variations = product.variations;
          }
          
          const updatedVariations = variations.map(variation => {
            if (variation.size === orderItem.selectedVariation) {
              const currentStock = parseInt(variation.stock) || 0;
              const orderedQuantity = parseInt(orderItem.quantity) || 0;
              return {
                ...variation,
                stock: Math.max(0, currentStock - orderedQuantity).toString()
              };
            }
            return variation;
          });
          
          return {
            ...product,
            variations: typeof product.variations === 'string' 
              ? JSON.stringify(updatedVariations)
              : updatedVariations
          };
        } else {
          // Update main product stock
          const currentStock = parseInt(product.stock) || 0;
          const orderedQuantity = parseInt(orderItem.quantity) || 0;
          return {
            ...product,
            stock: Math.max(0, currentStock - orderedQuantity)
          };
        }
      }
      return product;
    });
    
    setProducts(updatedProducts);
  };

  const calculateTotalPrice = () => {
    let total = 0;
    formData.items.forEach(item => {
      if (item.productId) {
        const price = getProductPrice(item);
        const safePrice = typeof price === 'number' ? price : parseFloat(price) || 0;
        const safeQuantity = typeof item.quantity === 'number' ? item.quantity : parseInt(item.quantity) || 1;
        total += safePrice * safeQuantity;
      }
    });
    return typeof total === 'number' ? total : 0;
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
    e.stopPropagation();
    
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

    // Validate stock availability
    for (let item of formData.items) {
      if (item.productId) {
        const availableStock = getProductStock(item);
        if (item.quantity > availableStock) {
          notifyError(`Insufficient stock for product. Available: ${availableStock}, Requested: ${item.quantity}`);
          return;
        }
      }
    }

    setLoading(true);
    try {
      // Clean up items to only include essential data for API
      const cleanItems = formData.items.filter(item => item.productId).map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: getProductPrice(item),
        selectedVariation: item.selectedVariation || null
      }));

      const orderPayload = {
        userId: formData.userId,
        paymentMethod: formData.paymentMethod,
        status: formData.status,
        totalPrice: calculateTotalPrice(),
        items: JSON.stringify(cleanItems),
        notes: formData.notes || "",
        // Receiver details will be populated from selected customer data
        reciever_name: users.find(u => u.id === parseInt(formData.userId))?.name || "",
        reciever_address: users.find(u => u.id === parseInt(formData.userId))?.address || "",
        reciever_contact: users.find(u => u.id === parseInt(formData.userId))?.phone || "",
      };

      // Debug: Log the payload being sent
      console.log("🔍 Clean Items:", cleanItems);
      console.log("🔍 Order Payload being sent:", orderPayload);

      let response;
      if (isEdit) {
        response = await OrderServices.updateOrder(orderData.id, orderPayload);
        notifySuccess("Order updated successfully!");
      } else {
        response = await OrderServices.createOrder(orderPayload);
        notifySuccess("Order created successfully!");
      }

      if (response) {
        // Update product stock after successful order creation
        if (!isEdit) {
          updateProductStock(cleanItems);
          resetForm();
        }
        // Call onSuccess callback if provided, passing the response data
        if (onSuccess && typeof onSuccess === 'function') {
          onSuccess(response);
        }
        // Close the drawer
        if (onClose && typeof onClose === 'function') {
          onClose();
        }
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
        <form onSubmit={handleSubmit} noValidate>
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
              <OrderItems
                formData={formData}
                products={products}
                onItemChange={(field, value) => {
                  if (field === "items") {
                    setFormData(prev => ({ ...prev, items: value }));
                  }
                }}
                onAddItem={addItem}
                onRemoveItem={removeItem}
                checkProductVariations={checkProductVariations}
                getProductVariations={getProductVariations}
                getProductPrice={getProductPrice}
                getProductStock={getProductStock}
                validateQuantity={validateQuantity}
              />

              {/* Order Summary */}
              <OrderSummary
                formData={formData}
                products={products}
                getProductPrice={getProductPrice}
                calculateTotalPrice={calculateTotalPrice}
              />

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

              <div className="grid grid-cols-12 gap-3 mt-6">
                <div className="col-span-6">
                  <Button
                    size="small"
                    layout="outline"
                    onClick={onClose}
                    disabled={loading}
                    className="w-full h-12"
                  >
                    Cancel
                  </Button>
                </div>
                <div className="col-span-6">
                  <Button
                    type="submit"
                    size="small"
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 text-white w-full h-12"
                  >
                    {loading ? "Saving..." : (isEdit ? "Update Order" : "Create Order")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Scrollbars>
    </>
  );
};

export default OrderDrawer; 