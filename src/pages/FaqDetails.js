import {  Button } from "@windmill/react-ui";
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

const FaqDetails = () => {
  const { id } = useParams();
  const { data, loading } = useAsync(() => FaqServices.getFaqById(id));
  // const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
  const {  handleUpdate } = useToggleDrawer();

  // const data = faqData.find((f) => f.id === id);
  //   console.log("🚀 ~ FaqDetails ~ data:", data)

  return (
    <>
      <div
        className="relative flex flex-col justify-center items-center pt-24"
        style={{ minHeight: "86vh" }}
      >
        <MainDrawer>
          <FaqDrawer id={id} />
        </MainDrawer>

        <Link to="/settings/faq">
          <button
            // onClick={toggleDrawer}
            className="absolute focus:outline-none z-50 base-color  hover:text-gray-700 transition-colors duration-150 bg-white shadow-md mr-6 mt-6 right-0 top-0 left-auto w-10 h-10 rounded-full block text-center"
          >
            <FiX className="mx-auto" />
          </button>
        </Link>

        <h3 className="text-4xl font-bold sm:w-5/6"> Faq {id}</h3>

        {/* <PageTitle className="text-3xl">Faq {id}</PageTitle> */}
        {loading ? (
          <Loading loading={loading} />
        ) : (
          // <div className="inline-block overflow-y-auto h-full align-middle transition-all transform">
          <div className=" py-10 sm:w-5/6  ">
            <h3 className="text-2xl font-bold py-10"> {data?.question}</h3>
            <p className="">{data?.answer}</p>
            <Button
              onClick={() => handleUpdate(id)}
              className=" w-40 my-10 rounded-md h-12"
            >
              <span className="mr-3">
                <FiEdit />
              </span>
              Edit Faq
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default FaqDetails;
