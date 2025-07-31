import React, { useContext } from "react";
import { Select } from "@windmill/react-ui";

import OrderServices from "../../services/OrderServices";
import { notifySuccess, notifyError } from "../../utils/toast";
import { SidebarContext } from "../../context/SidebarContext";
import SubscriptionServices from "../../services/SubscriptionServices";
import UserServices from "../../services/UserServices";
import MessageServices from "../../services/MessageServices";

const SelectStatus = ({ id, order, component, role }) => {
  const { setIsUpdate } = useContext(SidebarContext);

  const handleChangeStatus = (id, status) => {
    OrderServices.updateOrder(id, { status: status })
      .then((res) => {
        notifySuccess(res.message);
        setIsUpdate(true);
      })
      .catch((err) => notifyError(err.message));
  };

  const handleChangeSubscriptionStatus = (id, status) => {
    SubscriptionServices.updateSubscriptionStatus(id, { status: status })
      .then((res) => {
        notifySuccess(res.message);
        setIsUpdate(true);
      })
      .catch((err) => notifyError(err.message));
  };
  const handleChangeMessageStatus = (id, status) => {
    MessageServices.updateMessageStatus(id, { status: status })
      .then((res) => {
        notifySuccess(res.message);
        setIsUpdate(true);
      })
      .catch((err) => notifyError(err.message));
  };

  const handleChangeUserStatus = (id, key, status) => {
    UserServices.updateUserStatus(id, { [key]: status })
      .then((res) => {
        notifySuccess(res.message);
        setIsUpdate(true);
      })
      .catch((err) => notifyError(err.message));
  };

  return (
    <>
      {component === "subscription" ? (
        <Select
          onChange={(e) => handleChangeSubscriptionStatus(id, e.target.value)}
          className="border border-gray-50 bg-gray-50 dark:border-gray-700 h-8 rounded-md text-xs focus:border-gray-400 focus:outline-none"
        >
          {/* <option value="status" defaultValue hidden> */}
          <option value="status" hidden>
            {order?.status}
          </option>
          <option defaultValue={order?.status === "active"} value="active">
            Active
          </option>
          <option defaultValue={order?.status === "expired"} value="expired">
            Expired
          </option>
          <option defaultValue={order?.status === "canceled"} value="canceled">
            Cancel
          </option>
        </Select>
      ) : component === "message" ? (
        <Select
          onChange={(e) =>
            handleChangeMessageStatus(id, e.target.value)
          }
          className="border border-gray-50 bg-gray-50 dark:border-gray-700 h-8 rounded-md text-xs focus:border-gray-400 focus:outline-none"
        >
          {" "}
          <option value="status" hidden>
            {order.status}
          </option>
          <option defaultValue={order?.status === "pending"} value="pending">
            Pending
          </option>
          <option defaultValue={order?.status === "resolved"} value="resolved">
            Resolved
          </option>
        </Select>
      ) : component === "customer-verification" ? (
        <Select
          onChange={(e) =>
            handleChangeUserStatus(id, "isVerified", e.target.value)
          }
          className="border border-gray-50 bg-gray-50 dark:border-gray-700 h-8 rounded-md text-xs focus:border-gray-400 focus:outline-none"
        >
          {/* <option value="status" defaultValue hidden> */}
          <option value="status" hidden>
            {order.isVerified ? "verified" : "non-verified"}
          </option>
          <option defaultValue={order?.isVerified === true} value={true}>
            Verified
          </option>
          <option defaultValue={order?.isVerified === false} value={false}>
            Non-Verified
          </option>
        </Select>
      ) : component === "customer" && role ? (
        <Select
          onChange={(e) => handleChangeUserStatus(id, "status", e.target.value)}
          className="border border-gray-50 bg-gray-50 dark:border-gray-700 h-8 rounded-md text-xs focus:border-gray-400 focus:outline-none"
        >
          <option value="status" hidden>
            {order?.role}
          </option>
          <option defaultValue={order?.status === "admin"} value="admin">
            Admin
          </option>
          <option defaultValue={order?.status === "user"} value="user">
            User
          </option>
        </Select>
      ) : component === "customer" ? (
        <Select
          onChange={(e) => handleChangeUserStatus(id, "status", e.target.value)}
          className="border border-gray-50 bg-gray-50 dark:border-gray-700 h-8 rounded-md text-xs focus:border-gray-400 focus:outline-none"
        >
          {/* <option value="status" defaultValue hidden> */}
          <option value="status" hidden>
            {order?.status}
          </option>
          <option defaultValue={order?.status === "active"} value="active">
            Active
          </option>
          <option defaultValue={order?.status === "block"} value="block">
            Block
          </option>
        </Select>
      ) : (
        <Select
          onChange={(e) => handleChangeStatus(id, e.target.value)}
          className="border border-gray-50 bg-gray-50 dark:border-gray-700 h-8 rounded-md text-xs focus:border-gray-400 focus:outline-none"
        >
          {/* <option value="status" defaultValue hidden> */}
          <option value="status" hidden>
            {order?.status}
          </option>
          <option
            defaultValue={order?.status === "Delivered"}
            value="Delivered"
          >
            Delivered
          </option>
          <option defaultValue={order?.status === "Pending"} value="Pending">
            Pending
          </option>
          <option
            defaultValue={order?.status === "Processing"}
            value="Processing"
          >
            Processing
          </option>
          <option defaultValue={order?.status === "Cancel"} value="Cancel">
            Cancel
          </option>
        </Select>
      )}
    </>
  );
};

export default SelectStatus;
