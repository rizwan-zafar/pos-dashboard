import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SidebarContext } from "../context/SidebarContext";
import { notifyError, notifySuccess } from "../utils/toast";
import VideoBannerServices from "../services/VideoBannerServices"; // Update service for video banner
import dayjs from "dayjs";

const useVideoBannerSubmit = (id) => {
  const [videoUrl, setVideoUrl] = useState("");
  const { isDrawerOpen, closeDrawer, setIsUpdate } = useContext(SidebarContext);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = ({ title, startDate, endingDate, alt, pId }) => {
    if (!videoUrl) {
      notifyError("Video is required!");
      return;
    }

    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endingDate);

    if (start >= end) {
      notifyError("Start date must be earlier than end date");
      return;
    }

    // Prepare video banner data
    const bannerData = {
      title,
      startDate,
      endingDate,
      video: videoUrl,
      alt,
      pId,
    };
 console.log("dara", bannerData);

    if (id) {
      // Update video banner
      VideoBannerServices.updateBanner(id, bannerData)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeDrawer();
    } else {
      // Add new video banner
      VideoBannerServices.addVideoBanner(bannerData)
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
      setValue("title", "");
      setValue("startDate", "");
      setValue("endingDate", "");
      setValue("alt", "");
      setValue("pId", "");
      setVideoUrl("");
      clearErrors();
      return;
    }

    if (id) {
      // Fetch video banner details by ID
      VideoBannerServices.getBannerById(id)
        .then((res) => {
          if (res) {
            const formattedStart = dayjs(res?.startDate).format(
              "YYYY-MM-DDTHH:mm"
            );
            const formattedEnd = dayjs(res?.endingDate).format(
              "YYYY-MM-DDTHH:mm"
            );

            setValue("title", res.title);
            setValue("startDate", formattedStart);
            setValue("endingDate", formattedEnd);
            setValue("alt", res.alt);
            setValue("pId", res.pId);
            setVideoUrl(res.video);
          }
        })
        .catch(() => {
          notifyError("There is a server error!");
        });
    }
  }, [id, setValue, isDrawerOpen]);

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    videoUrl,
    setVideoUrl,
  };
};

export default useVideoBannerSubmit;
