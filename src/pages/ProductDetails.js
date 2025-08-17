 import { Badge } from "@windmill/react-ui";
import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import useAsync from "../hooks/useAsync";
import MainDrawer from "../components/drawer/MainDrawer";
import useToggleDrawer from "../hooks/useToggleDrawer";
import Loading from "../components/preloader/Loading";
import PageTitle from "../components/Typography/PageTitle";
import ProductServices from "../services/ProductServices";
import ProductDrawer from "../components/drawer/ProductDrawer";



// Utility function to format date and time for variations
const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    
    // Get time in 12-hour format
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    
    return `${day} ${month}, ${year} ${displayHours}:${displayMinutes} ${ampm}`;
  } catch (error) {
    return "Invalid Date";
  }
};

const ProductDetails = () => {
  const { id } = useParams();
  const history = useHistory();
  const { handleUpdate } = useToggleDrawer();
  const { data, loading } = useAsync(() => ProductServices.getProductById(id));

  console.log("ProductDetails - Complete API Response:", data);
  console.log("ProductDetails - Data type:", typeof data);
  console.log("ProductDetails - Data keys:", data ? Object.keys(data) : 'No data');

  const [variations, setVariations] = useState([]);
  const [lowestPriceVariation, setLowestPriceVariation] = useState(null);

  useEffect(() => {
    if (data?.variations) {
      try {
        const parsedVariations = JSON.parse(data.variations);
        if (Array.isArray(parsedVariations)) {
          const lowest = parsedVariations.sort((a, b) => {
            const priceA = a.promo_price_pkr || a.price;
            const priceB = b.promo_price_pkr || b.price;
            return priceA - priceB;
          });
          setVariations(lowest);
          setLowestPriceVariation(lowest[0]);
        }
      } catch (error) {
        console.error("Invalid variations format:", error);
        setVariations([]);
        setLowestPriceVariation(null);
      }
    }
  }, [data]);

  // Get the actual product data, handling different response structures
  const productData = data?.data || data;
  const isOutOfStock = productData?.stock <= 0 && (!variations || variations.every((variation) => variation.stock === 0));

  return (
    <>
      <MainDrawer>
        <ProductDrawer id={id} />
      </MainDrawer>

      <PageTitle>Product Details</PageTitle>
      {loading ? (
        <Loading loading={loading} />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Product Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
                <div className="flex items-center space-x-3">
                  <Badge type={data?.status === "Show" ? "success" : "danger"}>
                    {data?.status === "Show" ? "Active" : "Hidden"}
                  </Badge>
                  <Badge type={isOutOfStock ? "danger" : "success"}>
                    {isOutOfStock ? "Out of Stock" : "In Stock"}
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => handleUpdate(id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Edit Product
                  </button>
                  <button
                    onClick={() => history.push(`/product-invoice/${id}`)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Generate Invoice
                  </button>
                </div>
              </div>
              
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {productData?.title}
              </h1>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                SKU: <span className="font-mono font-semibold">{productData?.id}</span>
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Main Product Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Product Images */}
              <div className="xl:col-span-1">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800 h-full">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Product Images</h3>
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {(() => {
                      const productData = data?.data || data;
                      const image = productData?.image;
                      const gallery = productData?.gallery;
                      
                      // Priority: Gallery first (since it's the main image storage)
                      if (gallery && gallery !== "[]") {
                        try {
                          const galleryArray = JSON.parse(gallery);
                          
                          if (Array.isArray(galleryArray) && galleryArray.length > 0) {
                            return (
                              <div className="space-y-4">
                                <div className="text-center">
                                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700">
                                    {galleryArray.length} Image{galleryArray.length !== 1 ? 's' : ''}
                                  </span>
                                </div>
                                
                                {/* Main featured image */}
                                <div className="relative flex items-center justify-center h-64">
                                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-emerald-200 dark:border-emerald-700 p-4 shadow-sm">
                                    <img
                                      src={`/upload/${galleryArray[0]}`}
                                      alt={`${productData?.title} - Main Image`}
                                      className="max-w-full max-h-full object-contain rounded-lg"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                      }}
                                    />
                                  </div>
                                  <div className="hidden absolute inset-0 flex items-center justify-center">
                                    <span className="text-gray-500 text-sm">Main image not available</span>
                                  </div>
                                </div>
                                
                                {/* Thumbnail grid */}
                                {galleryArray.length > 1 && (
                                  <div className="grid grid-cols-4 gap-3">
                                    {galleryArray.slice(1).map((file, i) => (
                                      <div key={i} className="relative group flex items-center justify-center h-16">
                                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-emerald-200 dark:border-emerald-700 p-1 shadow-sm">
                                          <img
                                            src={`/upload/${file}`}
                                            alt={`${productData?.title} - Image ${i + 2}`}
                                            className="max-w-full max-h-full object-contain cursor-pointer transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg rounded"
                                            onError={(e) => {
                                              e.target.style.display = 'none';
                                              e.target.nextSibling.style.display = 'block';
                                            }}
                                          />
                                        </div>
                                        <div className="hidden absolute inset-0 flex items-center justify-center">
                                          <span className="text-gray-400 text-xs">Image {i + 2}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
              )}
            </div>
                            );
                          }
                        } catch (error) {
                          console.log("Error parsing gallery:", error);
                          return (
                            <div className="w-full h-64 flex items-center justify-center">
                              <div className="text-center bg-white dark:bg-gray-800 rounded-lg border border-emerald-200 dark:border-emerald-700 p-6">
                                <svg className="w-16 h-16 text-emerald-400 dark:text-emerald-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">Gallery parsing error</p>
                              </div>
                            </div>
                          );
                        }
                      }
                      
                      // Fallback: Single image if gallery is empty
                      if (image && image !== "") {
                        return (
                          <div className="relative flex items-center justify-center h-64">
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-emerald-200 dark:border-emerald-700 p-4 shadow-sm">
                              <img
                                src={`/upload/${image}`}
                                alt={productData?.title}
                                className="max-w-full max-h-full object-contain rounded-lg"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'block';
                                }}
                              />
                            </div>
                            <div className="hidden absolute inset-0 flex items-center justify-center">
                              <span className="text-gray-500 text-sm">Image not available</span>
                            </div>
                          </div>
                        );
                      }
                      
                      // No images available
                      return (
                        <div className="w-full h-64 flex items-center justify-center">
                          <div className="text-center bg-white dark:bg-gray-800 rounded-lg border border-emerald-200 dark:border-emerald-700 p-6">
                            <svg className="w-16 h-16 text-emerald-400 dark:text-emerald-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">No images available</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Product Information & Pricing */}
              <div className="xl:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 h-full">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-full">
                    {/* Pricing Section */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800 h-full flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Pricing Details</h3>
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
                        {/* Current Price */}
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Current Price</p>
                          <div className="flex flex-wrap items-baseline justify-center gap-3">
                            <span className="text-3xl sm:text-4xl font-bold text-green-600">
                              Rs {variations && variations.length > 0
                                ? (lowestPriceVariation?.promo_price_pkr > 0 ? lowestPriceVariation?.promo_price_pkr : lowestPriceVariation?.price)
                                : (productData?.promo_price_pkr > 0 ? productData?.promo_price_pkr : productData?.price)
                              }
                            </span>
                            
                            {((variations && variations.length > 0 && lowestPriceVariation?.promo_price_pkr > 0) ||
                              (!lowestPriceVariation && productData?.promo_price_pkr > 0)) && (
                              <span className="text-xl sm:text-2xl text-gray-500 line-through">
                                Rs {variations && variations.length > 0 
                                  ? lowestPriceVariation?.price 
                                  : productData?.price
                                }
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Savings Badge */}
                        {((variations && variations.length > 0 && lowestPriceVariation?.promo_price_pkr > 0) ||
                          (!lowestPriceVariation && productData?.promo_price_pkr > 0)) && (
                          <div className="text-center">
                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                              🎉 Save Rs {variations && variations.length > 0 
                                ? (lowestPriceVariation?.price - lowestPriceVariation?.promo_price_pkr)
                                : (productData?.price - productData?.promo_price_pkr)
                              }
                            </span>
                          </div>
                        )}
                        
                        {/* Delivery Information */}
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Delivery</p>
                          {productData?.delivery > 0 ? (
                            <div className="flex items-center justify-center space-x-2">
                              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                                Rs {productData.delivery}
                </span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center space-x-2">
                              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-lg font-semibold text-green-600">Free Delivery</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Product Information</h3>
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1a3 3 0 01-3-3V9a3 3 0 013-3h1m-1 0l-1 1m1-1l1 1m-1 0h1a3 3 0 013 3v1a3 3 0 01-3 3h-1m1 0l-1-1m1 1l1-1m-1 0h-1a3 3 0 01-3-3V9a3 3 0 013-3h1" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Product Code</span>
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white text-sm">{productData?.productCode || "N/A"}</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Parent Category</span>
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white text-sm">{productData?.parent || "N/A"}</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Sub Category</span>
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white text-sm">{productData?.children || "N/A"}</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Brand</span>
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white text-sm">{productData?.brand || "No Brand"}</span>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Stock Status</span>
                          </div>
                          <div className="flex flex-col items-end space-y-1">
                            <span className={`font-semibold text-sm ${(() => {
                              // If product has variations, sum all variation stocks
                              if (variations && Array.isArray(variations) && variations.length > 0) {
                                const totalStock = variations.reduce((sum, variation) => {
                                  const stock = parseInt(variation.stock) || 0;
                                  return sum + stock;
                                }, 0);
                                return totalStock > 0 ? 'text-green-600' : 'text-red-600';
                              }
                              // If no variations, check direct stock value
                              return (productData?.stock || 0) > 0 ? 'text-green-600' : 'text-red-600';
                            })()}`}>
                              {(() => {
                                // If product has variations, sum all variation stocks
                                if (variations && Array.isArray(variations) && variations.length > 0) {
                                  const totalStock = variations.reduce((sum, variation) => {
                                    const stock = parseInt(variation.stock) || 0;
                                    return sum + stock;
                                  }, 0);
                                  return `${totalStock} units available`;
                                }
                                // If no variations, show direct stock value
                                return `${productData?.stock || 0} units available`;
                              })()}
                            </span>
                            {(() => {
                              // Check if stock is low (less than 10)
                              let totalStock = 0;
                              if (variations && Array.isArray(variations) && variations.length > 0) {
                                totalStock = variations.reduce((sum, variation) => {
                                  const stock = parseInt(variation.stock) || 0;
                                  return sum + stock;
                                }, 0);
                              } else {
                                totalStock = parseInt(productData?.stock) || 0;
                              }
                              
                              if (totalStock > 0 && totalStock < 10) {
                                return (
                                  <div className="flex items-center space-x-1 text-xs">
                                    <svg className="w-3 h-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-orange-600 dark:text-orange-400 font-medium">Low Stock Alert!</span>
                                  </div>
                                );
                              }
                              return null;
                            })()}
                          </div>
              </div>

                        <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Created Date</span>
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white text-sm">
                            {productData?.updatedAt ? formatDateTime(productData.updatedAt) : "N/A"}
                        </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Variations Section */}
            {variations && variations.length > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Product Variations</h3>
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full">
                    <thead>
                      <tr className="border-b-2 border-blue-200 dark:border-blue-700">
                        <th className="text-left py-4 px-4 text-sm font-bold text-blue-800 dark:text-blue-200">Size</th>
                        <th className="text-left py-4 px-4 text-sm font-bold text-blue-800 dark:text-blue-200">Stock</th>
                        <th className="text-left py-4 px-4 text-sm font-bold text-blue-800 dark:text-blue-200">Price</th>
                        <th className="text-left py-4 px-4 text-sm font-bold text-blue-800 dark:text-blue-200">Status</th>
                        <th className="text-left py-4 px-4 text-sm font-bold text-blue-800 dark:text-blue-200">Last Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variations.map((variation, index) => (
                        <tr key={index} className="border-b border-blue-100 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200">
                          <td className="py-4 px-4">
                            <div className="max-w-24 sm:max-w-32">
                              <span className="font-semibold text-gray-900 dark:text-white capitalize text-sm break-words">
                                {variation.size || "Standard"}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col space-y-1">
                              <span className="font-semibold text-gray-900 dark:text-white text-sm">
                                {variation.stock}
                              </span>
                              {parseInt(variation.stock) > 0 && parseInt(variation.stock) < 10 && (
                                <div className="flex items-center space-x-1 text-xs">
                                  <svg className="w-3 h-3 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  <span className="text-orange-600 dark:text-orange-400 font-medium">Low Stock</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                              <span className="font-bold text-green-600 text-sm">
                                Rs {variation.promo_price_pkr || variation.price}
                              </span>
                              {variation.promo_price_pkr && (
                                <span className="text-sm text-gray-500 line-through">
                                  Rs {variation.price}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Badge type={variation.stock > 0 ? "success" : "danger"}>
                              {variation.stock > 0 ? "In Stock" : "Out of Stock"}
                  </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-gray-600 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {formatDateTime(variation.updated_at)}
                </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Seller Information */}
            {productData?.user && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Vendor Information</h3>
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Vendor Name</span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">{productData.user.name}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white text-sm break-all max-w-32">{productData.user.email}</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Phone</span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">{productData.user.phone}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-700 h-fit">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Address</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm leading-relaxed max-w-48 text-right">
                      {productData.user.address}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Description</h3>
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-amber-700 p-4">
                <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
                  <p className="leading-relaxed text-sm sm:text-base">{productData?.description || "No description available."}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
