import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";

import { notifySuccess, notifyError } from "../../utils/toast";
import ProductServices from "../../services/ProductServices";
import CategoryServices from "../../services/CategoryServices";
import { SidebarContext } from "../../context/SidebarContext";
import BannerServices from "../../services/BannerServices";
import AppPromoServices from "../../services/AppPromoServices";
import ReviewServices from "../../services/ReviewServices";
import VideoBannerServices from "../../services/VideoBannerServices";

const ShowHideButton = ({ id, status }) => {
  
  const location = useLocation();

  const { setIsUpdate } = useContext(SidebarContext);

  const handleChangeStatus = (id) => {
    let newStatus;
    if (status === "Show" ) {
      newStatus = "Hide";
    }else if (status === "Hide"){
      newStatus = "Show";
    }
    else if(status === "block"){
      newStatus = "unblock";
    }
    else if (status === "unblock"){
      newStatus = "block";
    }
    else if (status === true){
      newStatus = false;
    }else{
      newStatus = true;
    }

    if (location.pathname === "/category") {
      CategoryServices.updateStatus(id, { status: newStatus })
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
    }
    if (location.pathname === "/settings/banner") {
      BannerServices.updateStatus(id, { isVisible: newStatus })
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
    }
    if (location.pathname === "/settings/video-banner") {
      VideoBannerServices.updateStatus(id, { isVisible: newStatus })
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
    }
    if (location.pathname === "/settings/app-promotion") {
      AppPromoServices.updateStatus(id, { isVisible: newStatus })
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
    }

    if (location.pathname === "/products") {
      ProductServices.updateStatus(id, { status: newStatus })
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
    }
     if (location.pathname === "/reviews") {
      ReviewServices.updateStatus(id, { status: newStatus })
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
    }
  };

  return (
    <span
      // className="cursor-pointer  text-3xl flex justify-center text-center"
      className="cursor-pointer  text-3xl text-center"
      onClick={() => handleChangeStatus(id)}
    >
      {status === "unblock" ||status === "Show" || status ===true ? (
        <BsToggleOn className="base-color " />
      ) : (
        <BsToggleOff className="text-orange-500" />
      )}
    </span>
  );
};

export default ShowHideButton;
