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

  console.log("data____",data)
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

  const isOutOfStock = data?.stock <= 0 && (!variations || variations.every((variation) => variation.stock === 0));

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
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Badge type={data?.status === "Show" ? "success" : "danger"}>
                    {data?.status === "Show" ? "Active" : "Hidden"}
                  </Badge>
                  <Badge type={isOutOfStock ? "danger" : "success"}>
                    {isOutOfStock ? "Out of Stock" : "In Stock"}
                  </Badge>
                </div>
                <div className="flex items-center space-x-3">
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
              
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {data?.title}
              </h1>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                SKU: <span className="font-mono font-semibold">{data?.id}</span>
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Main Product Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Product Images */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 h-full">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Product Images</h3>
                  <div className="flex items-center justify-center min-h-[200px]">
                    {data?.image && data.image !== "" ? (
                      <div className="flex justify-center">
                        <img
                          src={data.image.replace("5055", "4000")}
                          alt={data?.title}
                          className="w-full max-w-48 h-auto rounded-lg object-contain"
                        />
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        {JSON.parse(data?.gallery || '[]').map((file, i) => (
                          <img
                            key={i}
                            src={file.replace("5055", "4000")}
                            alt={`${data?.title} - Image ${i + 1}`}
                            className="w-full h-auto max-h-24 rounded-lg object-contain"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Product Information & Pricing */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 h-full">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                    {/* Pricing Section */}
                    <div className="flex flex-col justify-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pricing Details</h3>
                      
                      {/* Current Price */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Price</p>
                        <div className="flex items-baseline space-x-3">
                          <span className="text-3xl font-bold text-green-600">
                            Rs {variations && variations.length > 0
                              ? (lowestPriceVariation?.promo_price_pkr > 0 ? lowestPriceVariation?.promo_price_pkr : lowestPriceVariation?.price)
                              : (data?.promo_price_pkr > 0 ? data?.promo_price_pkr : data?.price)
                            }
                          </span>
                          
                          {((variations && variations.length > 0 && lowestPriceVariation?.promo_price_pkr > 0) ||
                            (!lowestPriceVariation && data?.promo_price_pkr > 0)) && (
                            <span className="text-xl text-gray-500 line-through">
                              Rs {variations && variations.length > 0 
                                ? lowestPriceVariation?.price 
                                : data?.price
                              }
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Original Price */}
                      {((variations && variations.length > 0 && lowestPriceVariation?.promo_price_pkr > 0) ||
                        (!lowestPriceVariation && data?.promo_price_pkr > 0)) && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Original Price</p>
                          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            Rs {variations && variations.length > 0 
                              ? lowestPriceVariation?.price 
                              : data?.price
                            }
                          </p>
                        </div>
                      )}
                      
                      {/* Delivery Information */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Delivery</p>
                        {data?.delivery > 0 ? (
                          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            Rs {data.delivery}
                          </p>
                        ) : (
                          <p className="text-lg font-semibold text-green-600">Free Delivery</p>
                        )}
                      </div>
                      
                      {/* Savings */}
                      {((variations && variations.length > 0 && lowestPriceVariation?.promo_price_pkr > 0) ||
                        (!lowestPriceVariation && data?.promo_price_pkr > 0)) && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">You Save</p>
                          <p className="text-lg font-semibold text-red-600">
                            Rs {variations && variations.length > 0 
                              ? (lowestPriceVariation?.price - lowestPriceVariation?.promo_price_pkr)
                              : (data?.price - data?.promo_price_pkr)
                            }
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col justify-center">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Information</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Product Code</p>
                          <p className="font-medium text-gray-900 dark:text-white">{data?.productCode || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Parent Category</p>
                          <p className="font-medium text-gray-900 dark:text-white">{data?.parent || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Sub Category</p>
                          <p className="font-medium text-gray-900 dark:text-white">{data?.children || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Brand</p>
                          <p className="font-medium text-gray-900 dark:text-white">{data?.brand || "No Brand"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Stock Status</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {data?.stock || 0} units available
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Created Date</p>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : "N/A"}
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
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Product Variations</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Size</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Stock</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Price</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600 dark:text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {variations.map((variation, index) => (
                        <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="py-3 px-4">
                            <span className="font-medium text-gray-900 dark:text-white capitalize">
                              {variation.size || "Standard"}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {variation.stock}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-green-600">
                                Rs {variation.promo_price_pkr || variation.price}
                              </span>
                              {variation.promo_price_pkr && (
                                <span className="text-sm text-gray-500 line-through">
                                  Rs {variation.price}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4">
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
            {data?.user && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Seller Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Seller Name</p>
                      <p className="font-medium text-gray-900 dark:text-white">{data.user.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
                      <p className="font-medium text-gray-900 dark:text-white">{data.user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Phone</p>
                      <p className="font-medium text-gray-900 dark:text-white">{data.user.phone}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Address</p>
                    <p className="font-medium text-gray-900 dark:text-white text-sm leading-relaxed">
                      {data.user.address}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Description</h3>
              <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
                <p className="leading-relaxed">{data?.description || "No description available."}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
