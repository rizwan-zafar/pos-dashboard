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
        <div className="max-w-6xl mx-auto">
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

          <div className="space-y-6">
            {/* Main Product Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Product Images */}
              <div className="xl:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 h-full">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Product Images</h3>
                  <div className="flex items-center justify-center min-h-[200px]">
                    {/* Debug Information */}
                    <div className="mb-4 p-4 bg-gray-100 rounded text-xs">
                      <p><strong>Debug Info:</strong></p>
                      <p>Raw Data: {JSON.stringify(data, null, 2)}</p>
                      <p>Data Type: {typeof data}</p>
                      <p>Is Array: {Array.isArray(data) ? 'Yes' : 'No'}</p>
                      <p>Data Keys: {data ? Object.keys(data).join(', ') : 'No data'}</p>
                      <p>Image: {data?.image || 'No image'}</p>
                      <p>Gallery: {data?.gallery || 'No gallery'}</p>
                      <p>Base URL: {process.env.REACT_APP_IMAGE_UPLOAD_URL || 'http://localhost:5055/upload/'}</p>
                    </div>
                    
                    {/* Try different data structures */}
                    {(() => {
                      // Check if data is wrapped in a 'data' property
                      const productData = data?.data || data;
                      const image = productData?.image;
                      const gallery = productData?.gallery;
                      
                      console.log("ProductDetails - Processed data:", productData);
                      console.log("ProductDetails - Image field:", image);
                      console.log("ProductDetails - Gallery field:", gallery);
                      
                      // Priority: Gallery first (since it's the main image storage)
                      if (gallery && gallery !== "[]") {
                        try {
                          const galleryArray = JSON.parse(gallery);
                          console.log("ProductDetails - Parsed gallery array:", galleryArray);
                          
                          if (Array.isArray(galleryArray) && galleryArray.length > 0) {
                            return (
                              <div className="space-y-4">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Product Images ({galleryArray.length})</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {galleryArray.map((file, i) => (
                                    <div key={i} className="relative">
                                      <img
                                        src={`${process.env.REACT_APP_IMAGE_UPLOAD_URL || 'http://localhost:5055/upload/'}${file}`}
                                        alt={`${productData?.title} - Image ${i + 1}`}
                                        className="w-full h-32 sm:h-40 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                                        onError={(e) => {
                                          console.log("Gallery image failed to load:", e.target.src);
                                          e.target.style.display = 'none';
                                          // Show fallback for this specific image
                                          e.target.nextSibling.style.display = 'block';
                                        }}
                                        onLoad={(e) => console.log("Gallery image loaded successfully:", e.target.src)}
                                      />
                                      {/* Fallback for individual images */}
                                      <div className="hidden w-full h-32 sm:h-40 bg-gray-200 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600">
                                        <span className="text-gray-500 text-xs">Image {i + 1} not available</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          }
                        } catch (error) {
                          console.log("Error parsing gallery:", error);
                          return (
                            <div className="w-full max-w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-500 text-sm">Gallery parsing error</span>
                            </div>
                          );
                        }
                      }
                      
                      // Fallback: Single image if gallery is empty
                      if (image && image !== "") {
                        return (
                          <div className="flex justify-center">
                            <img
                              src={`${process.env.REACT_APP_IMAGE_UPLOAD_URL || 'http://localhost:5055/upload/'}${image}`}
                              alt={productData?.title}
                              className="w-full max-w-48 h-auto rounded-lg object-contain"
                              onError={(e) => {
                                console.log("Image failed to load:", e.target.src);
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                              onLoad={(e) => console.log("Image loaded successfully:", e.target.src)}
                            />
                            <div className="hidden w-full max-w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-500 text-sm">Image not available</span>
                            </div>
                          </div>
                        );
                      }
                      
                      // No images available
                      return (
                        <div className="w-full max-w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 text-sm">No images available</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Product Information & Pricing */}
              <div className="xl:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 h-full">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 h-full">
                    {/* Pricing Section */}
                    <div className="flex flex-col justify-center space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pricing Details</h3>
                      
                      {/* Current Price */}
                      <div className="mb-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Price</p>
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-2xl sm:text-3xl font-bold text-green-600">
                            Rs {variations && variations.length > 0
                              ? (lowestPriceVariation?.promo_price_pkr > 0 ? lowestPriceVariation?.promo_price_pkr : lowestPriceVariation?.price)
                              : (productData?.promo_price_pkr > 0 ? productData?.promo_price_pkr : productData?.price)
                            }
                          </span>
                          
                          {((variations && variations.length > 0 && lowestPriceVariation?.promo_price_pkr > 0) ||
                            (!lowestPriceVariation && productData?.promo_price_pkr > 0)) && (
                            <span className="text-lg sm:text-xl text-gray-500 line-through">
                              Rs {variations && variations.length > 0 
                                ? lowestPriceVariation?.price 
                          : productData?.price
                              }
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Original Price */}
                      {((variations && variations.length > 0 && lowestPriceVariation?.promo_price_pkr > 0) ||
                        (!lowestPriceVariation && productData?.promo_price_pkr > 0)) && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Original Price</p>
                          <p className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
                            Rs {variations && variations.length > 0 
                              ? lowestPriceVariation?.price 
                              : productData?.price
                            }
                          </p>
                        </div>
                    )}

                      {/* Delivery Information */}
                      <div className="mb-3">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Delivery</p>
                        {productData?.delivery > 0 ? (
                          <p className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-300">
                            Rs {productData.delivery}
                          </p>
                        ) : (
                          <p className="text-base sm:text-lg font-semibold text-green-600">Free Delivery</p>
                        )}
              </div>

                      {/* Savings */}
                      {((variations && variations.length > 0 && lowestPriceVariation?.promo_price_pkr > 0) ||
                        (!lowestPriceVariation && productData?.promo_price_pkr > 0)) && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">You Save</p>
                          <p className="text-base sm:text-lg font-semibold text-red-600">
                            Rs {variations && variations.length > 0 
                              ? (lowestPriceVariation?.price - lowestPriceVariation?.promo_price_pkr)
                              : (productData?.price - productData?.promo_price_pkr)
                            }
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col justify-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Product Information</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Product Code</p>
                          <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{productData?.productCode || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Parent Category</p>
                          <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{productData?.parent || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sub Category</p>
                          <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{productData?.children || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Brand</p>
                          <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{productData?.brand || "No Brand"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Stock Status</p>
                          <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                            {productData?.stock || 0} units available
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Created Date</p>
                          <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                            {productData?.createdAt ? new Date(productData.createdAt).toLocaleDateString() : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Variations Section */}
            {variations && variations.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Variations</h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">Size</th>
                        <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">Stock</th>
                        <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">Price</th>
                        <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variations.map((variation, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="py-3 px-2 sm:px-4">
                            <span className="font-medium text-gray-900 dark:text-white capitalize text-xs sm:text-sm">
                              {variation.size || "Standard"}
                            </span>
                          </td>
                          <td className="py-3 px-2 sm:px-4">
                            <span className="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                              {variation.stock}
                            </span>
                          </td>
                          <td className="py-3 px-2 sm:px-4">
                            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                              <span className="font-semibold text-green-600 text-xs sm:text-sm">
                                Rs {variation.promo_price_pkr || variation.price}
                              </span>
                              {variation.promo_price_pkr && (
                                <span className="text-xs sm:text-sm text-gray-500 line-through">
                                  Rs {variation.price}
                    </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-2 sm:px-4">
                            <Badge type={variation.stock > 0 ? "success" : "danger"}>
                              {variation.stock > 0 ? "In Stock" : "Out of Stock"}
                            </Badge>
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
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Seller Information</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Seller Name</p>
                      <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{productData.user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                      <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base break-all">{productData.user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                      <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{productData.user.phone}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Address</p>
                    <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base leading-relaxed">
                      {productData.user.address}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Description</h3>
              <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
                <p className="leading-relaxed text-sm sm:text-base">{productData?.description || "No description available."}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
