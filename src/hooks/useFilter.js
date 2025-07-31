import * as dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isToday from "dayjs/plugin/isToday";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

//internal import
import ProductServices from "../services/ProductServices";
import { notifyError, notifySuccess } from "../utils/toast";

const useFilter = (data) => {
  const [filter, setFilter] = useState(null);
  const [sortedField, setSortedField] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [searchCoupon, setSearchCoupon] = useState("");
  const [searchOrder, setSearchOrder] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [adminyType, setAdminType] = useState("");
  const [orderType, setOrderType] = useState("");
  const [reviewType, setReviewType] = useState("");
  const [customerOrderType, setCustomerOrderType] = useState("");
  const [subscriptionType, setSubscriptionType] = useState("");
  const [messageType, setMessageType] = useState("");
  const [pending, setPending] = useState([]);
  const [processing, setProcessing] = useState([]);
  const [delivered, setDelivered] = useState([]);
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [time, setTime] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dataTable, setDataTable] = useState([]); //tableTable for showing on table according to filtering
  const [todayOrder, setTodayOrder] = useState("");
  const [monthlyOrder, setMonthlyOrder] = useState("");
  const [totalOrder, setTotalOrder] = useState("");
  const [newProducts] = useState([]);
  const searchRef = useRef("");
  const userRef = useRef("");
  const couponRef = useRef("");
  const orderRef = useRef("");
  const subscriptionRef = useRef("");
  const messageRef = useRef("");
  const categoryRef = useRef("");
  const adminRef = useRef("");
  const reviewRef = useRef("");
  const customerOrderRef = useRef("");
  dayjs.extend(isBetween);
  dayjs.extend(isToday);
  const location = useLocation();

  //service data filtering
  const serviceData = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - time);
    let services = data;
    // console.log("----------- ",services);
    if (location.pathname === "/dashboard") {
      const orderPending = services?.filter(
        (statusP) => statusP.status === "Pending"
      );
      setPending(orderPending);
      const orderProcessing = services?.filter(
        (statusO) => statusO.status === "Processing"
      );
      setProcessing(orderProcessing);
      const orderDelivered = services?.filter(
        (statusD) => statusD.status === "Delivered"
      );
      setDelivered(orderDelivered);
      //daily total order calculation
      const todayServices = services?.filter((order) =>
        dayjs(order.createdAt).isToday()
      );
      const todayOrder = todayServices?.reduce(
        (preValue, currentValue) => preValue + currentValue.total,
        0
      );
      setTodayOrder(todayOrder);
      //monthly order calculation
      const monthlyServices = services?.filter((order) =>
        dayjs(order.createdAt).isBetween(
          new Date().setDate(new Date().getDate() - 30),
          new Date()
        )
      );
      const monthlyOrder = monthlyServices?.reduce(
        (preValue, currentValue) => preValue + currentValue.total,
        0
      );
      setMonthlyOrder(monthlyOrder);
      //total order calculation
      const totalOrder = services?.reduce(
        (preValue, currentValue) => preValue + currentValue.total,
        0
      );
      setTotalOrder(totalOrder);
    }

    //products filtering

    if (filter) {
      services = services.filter((item) => item.parent || item.name === filter);
    }

    if (sortedField === "Low") {
      services = services.sort((a, b) => a.price < b.price && -1);
    }
    if (sortedField === "High") {
      services = services.sort((a, b) => a.price > b.price && -1);
    }

    if (searchText) {
      services = services.filter((search) => 
        search.title.toLowerCase().includes(searchText?.toLowerCase()) ||
        search.productCode.toLowerCase().includes(searchText?.toLowerCase())
      );
    }

    //category searching
    if (categoryType) {
      services = services.filter((search) =>
        // search.type.toLowerCase().includes(categoryType.toLowerCase())
        search.name.toLowerCase().includes(categoryType.toLowerCase())
      );
    }
    if (adminyType) {
      services = services.filter((search) =>
          search.name.toLowerCase().includes(adminyType.toLowerCase()) ||
          search?.phone?.toLowerCase().includes(adminyType.toLowerCase()) ||
          search?.email?.toLowerCase().includes(adminyType.toLowerCase())
      );
    }
    //order searching
    if (orderType) {
      services = services.filter((search) =>
        ("#ON"+search.id).toLowerCase().includes(orderType.toLowerCase())
      );
    }

    if (reviewType) {
      services = services.filter((search) =>
        search?.user?.name?.toLowerCase().includes(reviewType.toLowerCase()) ||
        search?.reviewerName?.toLowerCase().includes(reviewType.toLowerCase()) ||
        search?.product?.title?.toLowerCase().includes(reviewType.toLowerCase())||
        search?.title?.toLowerCase().includes(reviewType.toLowerCase())||
        (search?.ratings+"")?.toLowerCase().includes(reviewType.toLowerCase())
      );
    }


    //customer Order searching
    if (customerOrderType) {
      services = services.filter((search) =>
        ("#ON"+search.id).toLowerCase().includes(customerOrderType.toLowerCase())
      );
    }

    //subscription searching
    if (subscriptionType) {
      services = services.filter((search) =>
        search.email.toLowerCase().includes(subscriptionType.toLowerCase())||
        search.status.toLowerCase().includes(subscriptionType.toLowerCase())
      );
    }
    //message searching
    if (messageType) {
      services = services.filter((search) =>
        search.email.toLowerCase().includes(messageType.toLowerCase())||
        search.status.toLowerCase().includes(messageType.toLowerCase())
      );
    }

    //admin Filtering

    if (role) {
      services = services.filter((staff) => staff.role === role);
    }

    //User and Admin filtering
    if (searchUser) {
      services = services.filter(
        (search) =>
          search.name.toLowerCase().includes(searchUser.toLowerCase()) ||
          search?.phone?.toLowerCase().includes(searchUser.toLowerCase()) ||
          search?.email?.toLowerCase().includes(searchUser.toLowerCase())
      );
    }

    //Coupon filtering

    if (searchCoupon) {
      services = services.filter(
        (search) =>
          search.title.toLowerCase().includes(searchCoupon.toLowerCase()) ||
          search.couponCode.toLowerCase().includes(searchCoupon.toLowerCase())
      );
    }

    // order filtering
    if (status) {
      services = services.filter((order) => order.status === status);
    }
    if (searchOrder) {
      services = services.filter((search) =>
        search.contact.toLowerCase().includes(searchOrder.toLowerCase())
      );
    }

    if (time) {
      services = services.filter((order) =>
        dayjs(order.createdAt).isBetween(date, new Date())
      );
    }

    return services;
  }, [
    filter,
    sortedField,
    data,
    searchText,
    searchUser,
    searchCoupon,
    searchOrder,
    categoryType,
    adminyType,
    orderType,
    reviewType,
    customerOrderType,
    subscriptionType,
    messageType,
    status,
    role,
    time,
    location,
  ]);

  //pagination functionality start

  const resultsPerPage = 8;
  const totalResults = serviceData?.length;

  const handleChangePage = (p) => {
    setCurrentPage(p);
  };

  useEffect(() => {
    setDataTable(
      serviceData?.slice(
        (currentPage - 1) * resultsPerPage,
        currentPage * resultsPerPage
      )
    );
  }, [serviceData, currentPage, resultsPerPage]);
  // console.log('dataaaaaaaaaaa' , serviceData);
  //pagination functionality end

  //table form submit function for search start

  const handleSubmitForAll = (e) => {
    e.preventDefault();
    setSearchText(searchRef.current.value);
  };

  const handleSubmitUser = (e) => {
    e.preventDefault();
    setSearchUser(userRef.current.value);
  };

  const handleSubmitCoupon = (e) => {
    e.preventDefault();
    setSearchCoupon(couponRef.current.value);
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    setOrderType(orderRef.current.value);
  };

  const handleSubmitCategory = (e) => {
    e.preventDefault();
    setCategoryType(categoryRef.current.value);
  };
  const handleSubmitAdmin = (e) => {
    e.preventDefault();
    setAdminType(adminRef.current.value);
  };
  const handleSubmitReview = (e) => {
    e.preventDefault();
    setReviewType(reviewRef.current.value);
    console.log("------->>>> ", reviewRef.current.value);
  };

  const handleSubmitCustomerOrder = (e) => {
    e.preventDefault();
    setCustomerOrderType(customerOrderRef.current.value);
  };
  const handleSubmiSubscription = (e) => {
    e.preventDefault();
    setSubscriptionType(subscriptionRef.current.value);
    console.log("------->>>> ", subscriptionRef.current.value);
  };
  const handleSubmiMessage = (e) => {
    e.preventDefault();
    setMessageType(messageRef.current.value);
  };

  //table form submit function for search end

  //handle submit multiple product data with csv format

  const handleOnDrop = (data) => {
    for (let i = 0; i < data?.length; i++) {
      if (data[i].data.sku !== "") {
        newProducts.push(data[i].data);
      }
    }
  };

  const handleUploadProducts = () => {
    if (newProducts.length < 1) {
      notifyError("Please upload/select csv file first!");
    } else {
      ProductServices.addAllProducts(newProducts)
        .then((res) => {
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
    }
  };

  return {
    userRef,
    searchRef,
    couponRef,
    orderRef,
    categoryRef,
    adminRef,
    reviewRef,
    customerOrderRef,
    subscriptionRef,
    messageRef,
    pending,
    processing,
    delivered,
    todayOrder,
    monthlyOrder,
    totalOrder,
    searchUser,
    searchOrder,
    setFilter,
    setSortedField,
    setStatus,
    categoryType,
    adminyType,
    orderType,
    reviewType,
    customerOrderType,
    subscriptionType,
    messageType,
    setRole,
    setTime,
    handleChangePage,
    totalResults,
    resultsPerPage,
    dataTable,
    serviceData,
    handleSubmitUser,
    handleSubmitForAll,
    handleSubmitCoupon,
    handleSubmitOrder,
    handleSubmitCategory,
    handleSubmitAdmin,
    handleSubmitReview,
    handleSubmitCustomerOrder,
    handleSubmiSubscription,
    handleSubmiMessage,
    handleOnDrop,
    handleUploadProducts,
    setCategoryType,
    setAdminType,
    setOrderType,
    setReviewType,
    setCustomerOrderType,
    setSubscriptionType,
    setMessageType,
    setSearchUser,
    setSearchOrder,
    
  };
};

export default useFilter;
