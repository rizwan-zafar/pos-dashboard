import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SidebarContext } from "../context/SidebarContext";
import UserServices from "../services/UserServices";
import { notifyError, notifySuccess } from "../utils/toast";

const useUserSubmit = (id) => {
  const [imageUrl, setImageUrl] = useState("");
  const { isDrawerOpen, closeDrawer, setIsUpdate } = useContext(SidebarContext);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      role: "",
      email: "",
      phone: "",
      opening_balance: "",
      ntn: "",
      strn: "",
      address: ""
    }
  });

  const onSubmit = ({ name, email, role, phone, opening_balance, ntn, strn, address }) => {
    if (!imageUrl) {
      notifyError("User image is required!");
      return;
    }
    
    // Extract filename from full URL if it's a full URL
    const imageFilename = imageUrl.includes(process.env.REACT_APP_IMAGE_UPLOAD_URL) 
      ? imageUrl.replace(process.env.REACT_APP_IMAGE_UPLOAD_URL, '') 
      : imageUrl;
    
    const userData = {
      name: name,
      role: role,
      email: email,
      phone: phone,
      opening_balance: opening_balance,
      ntn: ntn || "", // Ensure empty string if not provided
      strn: strn || "", // Ensure empty string if not provided
      address: address,
      image: imageFilename,
    };
    
    console.log("userData.....", userData);
    
    if (id) {
      UserServices.updateUser(id, userData)
        .then((res) => {
          console.log(res?.data);
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeDrawer();
    } else {
      UserServices.addUser(userData)
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
      setValue("name", "");
      setValue("role", "");
      setValue("email", "");
      setValue("phone", "");
      setValue("opening_balance", "");
      setValue("ntn", "");
      setValue("strn", "");
      setValue("address", "");
      setImageUrl("");
      clearErrors("name");
      clearErrors("email");
      clearErrors("phone");
      clearErrors("opening_balance");
      clearErrors("ntn");
      clearErrors("strn");
      clearErrors("address");
      return;
    }
    if (id) {
      UserServices.getUserById(id)
        .then((res) => {
          if (res) {
            setValue("name", res.name);
            setValue("role", res.role);
            setValue("email", res.email);
            setValue("phone", res.phone);
            setValue("opening_balance", res.opening_balance);
            setValue("ntn", res.ntn);
            setValue("strn", res.strn);
            setValue("address", res.address);
            // Construct full image URL for display in edit form
            const fullImageUrl = res.image ? `${process.env.REACT_APP_IMAGE_UPLOAD_URL}${res.image}` : "";
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
  };
};

export default useUserSubmit; 