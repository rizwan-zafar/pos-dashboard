import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SidebarContext } from "../context/SidebarContext";
import CategoryServices from "../services/CategoryServices";
import { notifyError, notifySuccess } from "../utils/toast";

const useCategorySubmit = (id) => {
  // const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [children, setChildren] = useState([]);
  const { isDrawerOpen, closeDrawer, setIsUpdate } = useContext(SidebarContext);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = ({ name, type }) => {
    if (!imageUrl) {
      notifyError("Icon is required!");
      return;
    }
    
    // Extract filename from full URL if it's a full URL
    const iconFilename = imageUrl.includes(process.env.REACT_APP_IMAGE_UPLOAD_URL) 
      ? imageUrl.replace(process.env.REACT_APP_IMAGE_UPLOAD_URL, '') 
      : imageUrl;
    
    const categoryData = {
      name: name,
      icon: iconFilename,
      children: children,
    };

    if (id) {
      CategoryServices.updateCategory(id, categoryData)
        .then((res) => {
          console.log(res?.data);
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeDrawer();
    } else {
      CategoryServices.addCategory(categoryData)
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
      setValue("parent");
      setValue("name");
      setValue("children");
      setValue("type");
      setImageUrl("");
      setChildren([]);
      clearErrors("parent");
      // setValue("slug");
      clearErrors("children");
      clearErrors("type");
      return;
    }
    if (id) {
      CategoryServices.getCategoryById(id)
        .then((res) => {
          if (res) {
            setValue("name", res.name);
            setChildren(JSON.parse(res.children));
            setValue("icon", res.icon);
            // Construct full image URL for display in edit form
            const fullImageUrl = res.icon ? `${process.env.REACT_APP_IMAGE_UPLOAD_URL}${res.icon}` : "";
            setImageUrl(fullImageUrl);
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
    setImageUrl,
    children,
    setChildren,
  };
};

export default useCategorySubmit;