import { Button } from "@windmill/react-ui";
import React from "react";
import { useParams } from "react-router";

import useAsync from "../hooks/useAsync";
import MainDrawer from "../components/drawer/MainDrawer";
import useToggleDrawer from "../hooks/useToggleDrawer";
import Loading from "../components/preloader/Loading";
// import PageTitle from "../components/Typography/PageTitle";
// import ProductServices from "../services/ProductServices";
// import ProductDrawer from "../components/drawer/ProductDrawer";
import FaqDrawer from "../components/drawer/FaqDrawer";
// import faqData from "../utils/faq";
import { FiEdit, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import FaqServices from "../services/FaqServices";
import BannerServices from "../services/BannerServices";
import PageTitle from "../components/Typography/PageTitle";
import dayjs from "dayjs";
import BannerDrawer from "../components/drawer/BannerDrawer";

const BannerDetails = () => {
  const { id } = useParams();
  const { data, loading } = useAsync(() => BannerServices.getBannerById(id));
  // const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
  const { handleUpdate } = useToggleDrawer();

  // const data = faqData.find((f) => f.id === id);
  //   console.log("🚀 ~ FaqDetails ~ data:", data)

  return (
    <>
      <div
        className="relative flex flex-col justify-center items-center pt-24"
        style={{ minHeight: "86vh" }}
      >
        <p
          className="text-lg font-bold  mr-6 mt-6 "
          style={{ position: "absolute", top: 14, left: 14 }}
        >
          {" "}
          Banner Details
        </p>

        <MainDrawer>
          <BannerDrawer id={id} />
        </MainDrawer>

        <Link to="/settings/banner">
          <button
            // onClick={toggleDrawer}
            className="absolute focus:outline-none z-50 base-color  hover:text-gray-700 transition-colors duration-150 bg-white shadow-md mr-6 mt-6 right-0 top-0 left-auto w-10 h-10 rounded-full block text-center"
          >
            <FiX className="mx-auto" />
          </button>
        </Link>
        {/* <p className=" mb-16 sm:w-5/6"> Banner Details</p> */}

        <h3 className="text-4xl font-bold sm:w-5/6"> {data?.title}</h3>

        {loading ? (
          <Loading loading={loading} />
        ) : (
          // <div className="inline-block overflow-y-auto h-full align-middle transition-all transform">
          <div className="  sm:w-5/6  ">
            <div className="font-serif font-semibold py-1 text-sm">
              <p className="text-sm text-gray-500 pr-4">
                Status:{" "}
                {data.isVisible ? (
                  <span className="base-color">This banner Showing</span>
                ) : (
                  <span className="text-red-400"> This banner Hidden</span>
                )}
              </p>
            </div>
            {/* <h3 className="text-2xl font-bold py-5"> {data?.title}</h3> */}
            <p className="font-serif font-semibold py-1 text-gray-500 text-sm">
              <span className="text-gray-700 dark:text-gray-400">
                Start Date:{" "}
              </span>{" "}
              {dayjs(data?.startDate).format("MMMM D, YYYY")}
            </p>
            <p className="font-serif font-semibold py-1 text-gray-500 text-sm">
              <span className="text-gray-700 dark:text-gray-400">
                End Date:{" "}
              </span>{" "}
              {dayjs(data?.endingDate).format("MMMM D, YYYY")}
            </p>
            <p className="font-serif font-semibold py-1 text-gray-500 text-sm">
              <span className="text-gray-700 dark:text-gray-400">
                Product Title:{" "}
              </span>{" "}
              {data?.product?.title}
            </p>

            {data?.image && data.image !== "" && (
              <img
                src={data?.image.replace("5055", "4000")}
                alt=""
                className="w-full max-w-[800px] h-auto md:w-[600px] lg:w-[800px] object-cover rounded-lg p-2"
              />
            )}
            <Button
              onClick={() => handleUpdate(id)}
              className=" w-40 my-10 rounded-md h-12"
            >
              <span className="mr-3">
                <FiEdit />
              </span>
              Edit Banner
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default BannerDetails;
