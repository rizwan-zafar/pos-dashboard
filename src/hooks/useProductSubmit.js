import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SidebarContext } from "../context/SidebarContext";
import ProductServices from "../services/ProductServices";
import { notifyError, notifySuccess } from "../utils/toast";
import useAsync from "./useAsync";
import CategoryServices from "../services/CategoryServices";

const generateProductCode = () => {
  const randomNumber1 = Math.floor(1000000000 + Math.random() * 9000000000); // 10 digit number
  const randomNumber2 = Math.floor(1000 + Math.random() * 9000); // 4 digit number
  return `PRD-${randomNumber1}-${randomNumber2}`;
};

const useProductSubmit = (id, type) => {
  const { data } = useAsync(CategoryServices.getAllCategory);
   

  const [imageUrl, setImageUrl] = useState([]);
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [children, setChildren] = useState("");
  const [stock, setStock] = useState();
  const [price, setPrice] = useState();
  const [price_usd, setPrice_usd] = useState();
  const [promo_price_pkr, setPromo_price_pkr] = useState();
  const [promo_price_usd, setPromo_price_usd] = useState();
  const [deliveryCharges, setDeliveryCharges] = useState();
  const [productCode, setProductCode] = useState("");
  const [tag, setTag] = useState([]);
  const { isDrawerOpen, closeDrawer, setIsUpdate } = useContext(SidebarContext);
  const [variations, setVariations] = useState([]);
 

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

 

  const onSubmit = (formData) => {    
     const result = data?.find(
      (parent) => formData?.parent?.toLowerCase() === parent?.name.toLowerCase()
    );

    if (!imageUrl) {
      notifyError("Image is required!");
      return;
    }

    // console.log('imageUrl', imageUrl);
    const productData = {
      title: formData.title,
      delivery: parseInt(formData.deliveryCharges),
      brand: formData.brand ? formData.brand : "No Brand",
      description: formData.description,
      parent: formData.parent,
      children: formData.children,
      price: variations.length > 0 ? null : formData.price,
      promo_price_pkr: variations.length > 0 ? null : formData.promo_price_pkr,
      price_usd: formData.price_usd,
      promo_price_usd: formData.promo_price_usd,
      productCode: formData.productCode ||  "",
      gallery: imageUrl.length > 1 ? JSON.stringify(imageUrl) : "[]",
      image: imageUrl.length === 1 ? imageUrl[0] : "",
      tag: JSON.stringify(tag),
      stock: formData.stock,
      category_id: result.id,
      variations:variations.length > 0 ?  variations : [],
      user_id:formData.user_id
    };

    console.log("product data_____",productData)
    if (id) {
      ProductServices.updateProduct(id, productData)
        .then((res) => {
          setIsUpdate(true);
         
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeDrawer();
    } else {
      // console.log(productData);
      
      ProductServices.addProduct(productData)
        .then((res) => {
          // console.log('addProduct ',res.reqz);

          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeDrawer();
    }
  };

  if (id && type) {
    ProductServices.getProductsByCategory(id)
      .then((res) => {
        if (res) {
          setValue("title", res.title);
          setValue("deliveryCharges", res.delivery);
          setValue("brand", res.brand);
          setValue("description", res.description);
          setValue("parent", res.parent);
          setValue("children", res.children);
          setValue("unit", res.unit);
          setValue("originalPrice", res.price);
          setValue("price", res.price);
          setValue("price_usd", res.price_usd);
          setValue("promo_price_pkr", res.promo_price_pkr);
          setValue("promo_price_usd", res.promo_price_usd);
          setValue("productCode", res.productCode || "");
          setProductCode(res.productCode || "");
          setVariations(JSON.parse(res.variations) );
          setTag(JSON.parse(res.tag));
          setImageUrl(res.image ? res.image : res.gallery);
        }
      })
      .catch((err) => {
        notifyError("There is a server error!");
      });
  }

  useEffect(() => {
    if (!isDrawerOpen) {
      setValue("sku");
      setValue("title");
      setValue("deliveryCharges");
      setValue("productCode");
      setValue("brand");
      setValue("slug");
      setValue("description");
      setValue("parent");
      setValue("children");
      setValue("type");
      setValue("unit");
      setValue("quantity");
      setValue("originalPrice");
       setValue("stock");
      setValue("price");
      setValue("price_usd");
      setValue("promo_price_pkr");
      setValue("promo_price_usd");
      setImageUrl("");
      setChildren("");
      setTag([]);
      clearErrors("sku");
      clearErrors("deliveryCharges");
      clearErrors("title");
      clearErrors("brand");
      clearErrors("slug");
      clearErrors("description");
      clearErrors("productCode");
      clearErrors("parent");
      clearErrors("children");
      clearErrors("type");
      clearErrors("unit");
      clearErrors("quantity");
      clearErrors("originalPrice");
      clearErrors("price");
       clearErrors("price_usd");
      clearErrors("promo_price_pkr");
      clearErrors("promo_price_usd");
      clearErrors("tax1");
      clearErrors("tax2");
      return;
    }

    if (id) {
      ProductServices.getProductById(id)
        .then((res) => {
           if (res) {
            setValue("sku", res.sku);
            setValue("title", res.title);
            setValue("deliveryCharges", res.delivery);
            setValue("brand", res.brand);
            setValue("slug", res.slug);
            setValue("description", res.description);
            setValue("parent", res.parent);
            setValue("children", res.children);
            setValue("type", res.type);
            setValue("unit", res.unit);
            setValue("quantity", res.quantity);
            setValue("stock", res.stock);
            setValue("price", res.price);
            setValue("price_usd", res.price_usd);
            setValue("promo_price_pkr", res.promo_price_pkr);
            setValue("promo_price_usd", res.promo_price_usd);
             setValue("productCode", res.productCode || "");
            setVariations(JSON.parse(res.variations));
             setProductCode(res.productCode || "");
            setTag(JSON.parse(res.tag));
            setImageUrl(res.image ? [res.image] : JSON.parse(res.gallery));
            setTitle(res.title);
            setDeliveryCharges(res.delivery);
            setBrand(res.brand);
          }
        })
        .catch((err) => {
          notifyError("There is a server error!");
        });
    }
   }, [id, setValue, isDrawerOpen]);

  useEffect(() => {
    setChildren(watch("children"));
  }, [watch, children]);

  return {
    setValue,
    register,
    watch,
    handleSubmit,
    onSubmit,
    errors,
    imageUrl,
    setImageUrl,
    tag,
    setTag,
    title,
    setTitle,
    deliveryCharges,
    setDeliveryCharges,
    brand,
    setBrand,
    stock,
    setStock,
    price,
    setPrice,
    price_usd,
    setPrice_usd,
    promo_price_pkr,
    setPromo_price_pkr,
    promo_price_usd,
    setPromo_price_usd,
    productCode,
    setProductCode,
    generateProductCode,
    isDrawerOpen,
    variations, setVariations
  };
};

export default useProductSubmit;
