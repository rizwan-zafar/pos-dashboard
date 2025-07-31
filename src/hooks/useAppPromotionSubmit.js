import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SidebarContext } from "../context/SidebarContext";
import { notifyError, notifySuccess } from "../utils/toast";
import PromoBannerServices from "../services/AppPromoServices";
import dayjs from "dayjs";

const useAppPromotionSubmit = (id) => {
  const [imageUrl, setImageUrl] = useState("");
  const [smImageUrl, setSmImageUrl] = useState("");
  const { isDrawerOpen, closeDrawer, setIsUpdate } = useContext(SidebarContext);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = ({
    title,
    startDate,
    endingDate,
    isVisible,
    app_store_url,
    play_store_url,
    alt,
    productId,
  }) => {
    if (!imageUrl) {
      notifyError("Image is required!");
      return;
    }
    if (!smImageUrl) {
      notifyError("Banner Small Image is required!");
      return;
    }

    /////// validate Date

    const start = new Date(startDate);
    const end = new Date(endingDate);

    if (start >= end) {
      notifyError("Start date must be earlier than end date");
      return;
    }

    /////// end validate Date

    const bannerData = {
      title: title,
      startDate: startDate,
      endingDate: endingDate,
      isVisible: isVisible,
      image: imageUrl,
      smImage: smImageUrl,
      app_store_url,
      play_store_url,
      alt,
      productId,
    };

    if (id) {
      PromoBannerServices.updatePromoBanner(id, bannerData)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeDrawer();
    } else {
      PromoBannerServices.addPromoBanner(bannerData)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeDrawer();
    }
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setValue("title");
      setValue("startDate");
      setValue("endingDate");
      setValue("app_store_url");
      setValue("play_store_url");
      setValue("alt");
      setValue("productId");
      // setValue("isVisible");
      setImageUrl("");
      setSmImageUrl("");
      clearErrors("title");
      clearErrors("startDate");
      clearErrors("endingDate");
      clearErrors("app_store_url");
      clearErrors("play_store_url");
      clearErrors("alt");
      clearErrors("productId");

      clearErrors("isVisible");
      return;
    }
    if (id) {
      console.log(id);
      PromoBannerServices.getPromoBannerById(id)

        .then((res) => {
          if (res) {
            console.log(res.startDate);

            const formattedStart = dayjs(res?.startDate).format(
              "YYYY-MM-DDTHH:mm"
            );
            const formattedEnd = dayjs(res?.endingDate).format(
              "YYYY-MM-DDTHH:mm"
            );

            setValue("startDate", formattedStart);
            setValue("endingDate", formattedEnd);
            setValue("title", res.title);
            setValue("isVisible", res.isVisible);
            setValue("app_store_url", res.app_store_url);
            setValue("play_store_url", res.play_store_url);
            setValue("alt", res.alt);
            setValue("productId", res.productId);

            setImageUrl(res.image);
            setSmImageUrl(res.smImage);
          }
        })
        .catch((err) => {
          notifyError("There is a server error!");
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setValue, isDrawerOpen]);
  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    imageUrl,
    smImageUrl,
    setValue,
    setImageUrl,
  setSmImageUrl
  };
};

export default useAppPromotionSubmit;
