import React, { useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Select, Textarea } from "@windmill/react-ui";
import ReactTagInput from "@pathofdev/react-tag-input";

import Title from "../form/Title";
import Error from "../form/Error";
import LabelArea from "../form/LabelArea";
import InputArea from "../form/InputArea";
import InputValue from "../form/InputValue";
import DrawerButton from "../form/DrawerButton";
import ChildrenCategory from "../category/ChildrenCategory";
import useProductSubmit from "../../hooks/useProductSubmit";
import useAsync from "../../hooks/useAsync";
import CategoryServices from "../../services/CategoryServices";
import UserServices from "../../services/UserServices";
import ProductImgUploader from "../image-uploader/ProductImgUploader";
import { FiX } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";

const ProductDrawer = ({ id }) => {
  const {
    register,
    watch,
    handleSubmit,
    onSubmit,
    errors,
    imageUrl,
    setImageUrl,
    tag,
    setTag,
    productCode,
    setValue,
    isDrawerOpen,
    variations,
    setVariations
  } = useProductSubmit(id);

  const { data } = useAsync(CategoryServices.getAllCategory);
  const { data: allUsers } = useAsync(UserServices.getAllUsers);

  useEffect(() => {
    if (isDrawerOpen && !id && productCode) {
      setValue("productCode", productCode);
    }
  }, [isDrawerOpen, productCode, id, setValue]);

  const addVariation = () => {
    setVariations([
      ...variations, {
        size: "",
        price: "",
        promo_price_pkr: ""
      },
    ]);
  };

  const updateVariation = (index, field, value) => {
    const updatedVariations = [...variations];
    updatedVariations[index][field] = value;
    setVariations(updatedVariations);
  };

  const removeVariation = (index) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {
          id ? (
            <Title title="Update Product" description="Update your product and necessary information from here" />
          ) : (
            <Title title="Add Product" description="Add your product and necessary information from here" />
          )
        } </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={
          handleSubmit(onSubmit)
        }
          className="block">
          <div className="px-6 pt-8 flex-grow w-full h-full max-h-full pb-40 md:pb-32 lg:pb-32 xl:pb-32">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Product Image" />
              <div className="col-span-8 sm:col-span-4">
                <ProductImgUploader imageUrl={imageUrl}
                  setImageUrl={setImageUrl} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Product Code" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea register={register}
                  required={true}
                  label="productCode"
                  name="productCode"
                  type="text"
                  placeholder="Enter Product Code" />
                <Error errorName={
                  errors.productCode
                } />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Name" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea register={register}
                  label="Name"
                  name="title"
                  type="text"
                  placeholder="Enter Name" />
                <Error errorName={
                  errors.title
                } />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Category" />
              <div className="col-span-8 sm:col-span-4">
                <Select className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white" name="parent" {...register("parent", {
                  required: "Product parent category is required!",
                })}>
                  <option value="" hidden>
                    Select category
                  </option>
                  {
                    data?.map((category) => (
                      <option key={
                        `${category.id
                        }`
                      }
                        value={
                          category.name
                        }>
                        {
                          category?.name
                        } </option>
                    ))
                  } </Select>
                <Error errorName={
                  errors.parent
                } />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Child Category" />
              <div className="col-span-8 sm:col-span-4">
                <Select className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white" name="children" {...register("children", {
                  required: "Product children category is required!",
                })}
                  value={
                    watch("children") || ""
                  }
                // Ensure it's never null
                >
                  {
                    !id && (
                      <option value="" hidden>
                        Select child category
                      </option>
                    )
                  }
                  <ChildrenCategory value={
                    watch("parent")
                  } />
                </Select>
                <Error errorName={
                  errors.children
                } />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Brand" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea register={register}
                  label="Brand"
                  name="brand"
                  type="text"
                  required={true}
                  placeholder="Enter Brand" />
                <Error errorName={
                  errors.brand
                } />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Price" />
              <div className="col-span-8 sm:col-span-4">
                <InputValue register={register}
                  // maxValue={2000}
                  minValue={1}
                  label="price ($)"
                  name="price"
                  type="number"
                  // {...register("price", {
                  //   required: "Price in PKR is required!",
                  // })}
                  {...register("price",
                    variations.length === 0
                      ? { required: "Price in PKR is required!" }
                      : {}
                  )}
                  placeholder="Price in $"
                  required={
                    variations.length > 0
                  }
                  disable={
                    variations.length > 0
                  }
                  value={
                    watch("price") || ""
                  }
                // Ensure it's never null
                />
                <Error errorName={
                  errors.price
                } />
              </div>
            </div>

            {/* Variations Section */}
            <div className="mb-6">
              <LabelArea label="Variations" />
              <div className="  mt-3">
                {
                  variations.map((variation, index) => (
                    <div key={index}
                      className="grid  gap-3   mb-6  p-4 rounded-lg "
                      style={
                        { gridTemplateColumns: "1fr 1fr 1fr 1fr 30px" }
                      }>
                      <input type="text" placeholder="Size" className="w-full h-12 border p-2 rounded-lg text-sm focus:outline-none bg-gray-100 dark:bg-white  focus:bg-white"
                        value={
                          variation.size
                        }
                        onChange={
                          (e) => updateVariation(index, "size", e.target.value)
                        } />
                      <input type="number" placeholder="Price ($)" className="w-full h-12 border p-2 rounded-lg text-sm focus:outline-none bg-gray-100 dark:bg-white  focus:bg-white"
                        value={
                          variation.price
                        }
                        min={1}
                        onChange={
                          (e) => updateVariation(index, "price", e.target.value)
                        } />
                      <input type="number" placeholder="Promo Price ($)" className="w-full h-12 border p-2 rounded-lg text-sm focus:outline-none bg-gray-100 dark:bg-white  focus:bg-white"
                        value={
                          variation.promo_price_pkr
                        }
                        onChange={
                          (e) => updateVariation(index, "promo_price_pkr", e.target.value)
                        } />
                      <input type="number" placeholder="Stock" className="w-full h-12 border p-2 rounded-lg text-sm focus:outline-none bg-gray-100 dark:bg-white  focus:bg-white"
                        value={
                          variation.stock
                        }
                        onChange={
                          (e) => updateVariation(index, "stock", e.target.value)
                        } />
                      <button type="button" className=" focus:outline-none z-50 text-red-500 hover:bg-green-100 hover:text-gray-700 transition-colors duration-150 bg-white shadow-md mr-6    w-10 h-10 rounded-full block text-center"
                        onClick={
                          () => removeVariation(index)
                        }>
                        <FiTrash2 className="mx-auto" />
                      </button>
                    </div>
                  ))
                }


                <button type="button"
                  className={
                    `base-color border-none outline-none focus:outline-none focus:ring-0 ${variations.some((v) => !v.size || !v.price) ? "opacity-50 cursor-not-allowed" : ""
                    }`
                  }
                  onClick={addVariation}
                  disabled={
                    variations.some((v) => !v.size || !v.price)
                  }>
                  + Add Variation
                </button>
              </div>
            </div>

            {/* <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Delivery Chargessss" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea register={register}
                  label="Delivery charges"
                  name="deliveryCharges"
                  minValue={1}
                  type="number"
                  placeholder="Enter Delivery Charges" />
                <Error errorName={
                  errors.deliveryCharges
                } />
              </div>
            </div> */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Vendor" />
              <div className="col-span-8 sm:col-span-4">
                <Select className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white" name="user_id" {...register("user_id", {
                  required: "Select Vendor",
                })} value={watch("user_id") || ""}>
                  <option value="" hidden>
                    Select Vendor
                  </option>
                  {
                    allUsers?.filter(user => user.role === 'vendor')?.map((user) => (
                      <option key={
                        `${user.id
                        }`
                      }
                        value={
                          user.id
                        }>
                        {
                          user?.name + " - " + user.email
                        } </option>
                    ))
                  } </Select>
                <Error errorName={
                  errors.parent
                } />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Stock" />
              <div className="col-span-8 sm:col-span-4">
                <InputValue register={register}
                  // maxValue={2000}
                  // minValue={1}
                  label="Stock"
                  name="stock"
                  type="number"
                  placeholder="Stock"
                  required={
                    variations.length > 0
                  }
                  disable={
                    variations.length > 0
                  }
                  value={
                    watch("stock") || ""
                  }
                // Ensure it's never null
                />
                <Error errorName={
                  errors.stock
                } />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Product Details" />
              <div className="col-span-8 sm:col-span-4">
                <Textarea className="border text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white" {...register("description", {
                  required: "Description is required!",
                  minLength: {
                    value: 20,
                    message: "Minimum 20 character!",
                  },
                })} name="description" placeholder="Product details" rows="4" spellCheck="false"
                  value={
                    watch("description") || ""
                  }
                // Ensure it's never null
                />
                <Error errorName={
                  errors.description
                } />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Tags" />
              <div className="col-span-8 sm:col-span-4">
                <ReactTagInput placeholder="Product Tag (Write then press enter to add new tag)"
                  tags={tag}
                  onChange={
                    (newTags) => setTag(newTags)
                  } />
              </div>
            </div>
          </div>

          <DrawerButton id={id}
            title="Product" />
        </form>
      </Scrollbars>
    </>
  );
};

export default React.memo(ProductDrawer);
