import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Modal, ModalBody, ModalFooter, Button , ModalHeader} from '@windmill/react-ui';
import { FiX, FiTrash2 } from 'react-icons/fi';

import ProductServices from '../../services/ProductServices';
import CategoryServices from '../../services/CategoryServices';
import { SidebarContext } from '../../context/SidebarContext';
import { notifySuccess, notifyError } from '../../utils/toast';
import useToggleDrawer from '../../hooks/useToggleDrawer';
import FaqServices from '../../services/FaqServices';
import OrderServices from '../../services/OrderServices';
import BannerServices from '../../services/BannerServices';
import AppPromoServices from '../../services/AppPromoServices';
import SubscriptionServices from '../../services/SubscriptionServices';
import UserServices from '../../services/UserServices';
import ReviewServices from '../../services/ReviewServices';
import AdminServices from '../../services/AdminServices';
import MessageServices from '../../services/MessageServices';
import VideoBannerServices from '../../services/VideoBannerServices';

const MainModal = ({ id, title }) => {
  const { isModalOpen, closeModal, setIsUpdate } = useContext(SidebarContext);
  const { setServiceId } = useToggleDrawer();
  const location = useLocation();

  // console.log("dddddddddd ", id, title);
  const handleDelete = () => {
    
    if (location.pathname === '/products') {
      ProductServices.deleteProduct(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
      setServiceId();
    }

     if (location.pathname === '/reviews') {
      ReviewServices.deleteReview(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
      setServiceId();
    }
    if (location.pathname === '/category') {
      CategoryServices.deleteCategory(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
      setServiceId();
    }

    if (location.pathname === '/faq') {
      FaqServices.deleteFaq(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
      setServiceId();
    }
    if (location.pathname === '/orders') {
      OrderServices.deleteOrder(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
      setServiceId();
    }
    if (location.pathname === '/customer/subscriptions') {
      SubscriptionServices.deleteSubscription(id=title)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
      setServiceId();
    }
    if (location.pathname === '/customer/user') {
      UserServices.deleteUser(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
      setServiceId();
    }
    if (location.pathname === '/messages') {
      MessageServices.deleteMessage(id=title)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
      setServiceId();
    }

    if (location.pathname === '/settings/banner') {
      BannerServices.deleteBanner(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
      setServiceId();
    }
    if (location.pathname === '/settings/video-banner') {
      VideoBannerServices.deleteBanner(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
      setServiceId();
    }
    if (location.pathname === '/settings/app-promotion') {
      AppPromoServices.deletePromoBanner(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
      setServiceId();
    }
    if (location.pathname === '/settings/admins') {
      AdminServices.deleteStaff(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
      setServiceId();
    }


  };

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        
      <ModalHeader className="flex justify-end ">
    <button onClick={closeModal} className="danger-bg-color text-white p-1 rounded-full focus:outline-none">
      <FiX />
    </button>
  </ModalHeader>
        <ModalBody className="text-center custom-modal px-8 pt-2 pb-4">

          <span className="flex justify-center text-3xl mb-6 text-red-500">
            <FiTrash2 />
          </span>
          <h2 className="text-xl font-medium mb-1">
            Are You Sure! Want to Delete{' '}
            <span className="text-red-500">{title}</span> Record?
          </h2>
          <p>
            Do you really want to delete these records? You can't view this in
            your list anymore if you delete!
          </p>
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button
            className="w-full sm:w-auto hover:bg-white hover:border-gray-50"
            layout="outline"
            onClick={closeModal}
          >
            No, Keep It
          </Button>
          <Button onClick={handleDelete} className="w-full sm:w-auto danger-bg-color ">
            Yes, Delete It
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default React.memo(MainModal);
