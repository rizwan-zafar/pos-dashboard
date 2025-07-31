import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SidebarContext } from "../context/SidebarContext";
import { notifyError, notifySuccess } from "../utils/toast";
import ReviewServices from "../services/ReviewServices";
import { AdminContext } from "../context/AdminContext";

const useReviewSubmit = (id) => {
  const { isDrawerOpen, closeDrawer, setIsUpdate } = useContext(SidebarContext);
 const { state } = useContext(AdminContext);
  const { adminInfo } = state;
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = (formData) => {
    const reviewData = {
      reviewerName: formData.reviewerName,
      userId: formData.userId,
      title: formData.title,
      message: formData.message,
      ratings: formData.rating,
      productId: id,
      adminId: adminInfo._id
    };

    ReviewServices.addReview(reviewData)
      .then((res) => {
        setIsUpdate(true);
        notifySuccess(res.message);
      })
      .catch((err) => notifyError(err.message));
    closeDrawer();
  };

  useEffect(() => {
    if (!isDrawerOpen) {
      setValue("reviewerName");
      setValue("userId");
      setValue("title");
      setValue("message");
      setValue("rating");
      clearErrors("title");
      clearErrors("reviewerName");
      clearErrors("userId");
      clearErrors("message");
      clearErrors("rating");
      return;
    }

   
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, setValue, isDrawerOpen]);

  return {
    setValue,
    register,
    watch,
    handleSubmit,
    onSubmit,
    errors,
    isDrawerOpen,
  };
};

export default useReviewSubmit;
