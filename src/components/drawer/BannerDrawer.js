// import React, { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import Error from "../form/Error";
import Title from "../form/Title";
import InputArea from "../form/InputArea";
import LabelArea from "../form/LabelArea";
import DrawerButton from "../form/DrawerButton";
import Uploader from "../image-uploader/Uploader";
import useBannerSubmit from "../../hooks/useBannerSubmit";
import ReactTagInput from "@pathofdev/react-tag-input";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import { useEffect, useState } from "react";
import ProductServices from "../../services/ProductServices";
import useAsync from "../../hooks/useAsync";
import { Select } from "@windmill/react-ui";


const BannerDrawer = ({ id }) => {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    imageUrl,
    setImageUrl,
        smImageUrl,
    setSmImageUrl

  } = useBannerSubmit(id);
  const [status, setStatus] = useState("Show");

  const { data } = useAsync(() => ProductServices._getAllProducts());

  // const handleChangeStatus = (id) => {
  //   let newStatus;
  //   if (status === "Show") {
  //     newStatus = "Hide";
  //   } else {
  //     newStatus = "Show";
  //   }
  //   setStatus(newStatus);
  // console.log(newStatus === "Show");

  // }
  // useEffect(()=>{
  //   setValue("isVisible", status === "Show");
  // },[status])

  return (
    <>
      <div className="w-full relative p-6  border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            title="Update Banner"
            description="Updated your Product category and necessary information from here"
          />
        ) : (
          <Title
            title="Add Banner"
            description=" Add your Product category and necessary information from here"
          />
        )}
      </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 flex-grow scrollbar-hide w-full max-h-full pb-40">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Banner Icon" />
              <div className="col-span-8 sm:col-span-4">
                <Uploader imageUrl={imageUrl} setImageUrl={setImageUrl} />
              </div>
            </div>

             <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label=" Banner Small Icon" />
              <div className="col-span-8 sm:col-span-4">
                <Uploader imageUrl={smImageUrl} setImageUrl={setSmImageUrl} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Banner Title" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Banner title"
                  name="title"
                  defaultValue=""
                  type="text"
                  placeholder="Enter title"
                />
                <Error errorName={errors.type} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Image Alternate" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Image Alternate"
                  name="alt"
                  defaultValue=""
                  type="text"
                  placeholder="Enter Image alternate text"
                />
                <Error errorName={errors.alt} />
              </div>
            </div>

                 <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Product" />
              <div className="col-span-8 sm:col-span-4">
                <Select
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  name="pId"
                  {...register("pId")}
                >
                  <option value="" hidden>
                    Select Product
                  </option>
                  {data?.map((product) => (
                    <option key={`${product.id}`} value={product.id}>
                      {product?.title}
                    </option>
                  ))}
                </Select>
                <Error errorName={errors.pId} />
              </div>
            </div>


            {/* Start Date */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Start Date" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Start Date"
                  name="startDate"
                  type="datetime-local"
                  // defaultValue={startDate}
                  placeholder="Select start date"
                />
                <Error errorName={errors.startDate} />
              </div>
            </div>

            {/* End Date */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="End Date" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="End Date"
                  name="endingDate"
                  type="datetime-local"
                  placeholder="Select end date"
                />
                <Error errorName={errors.endingDate} />
              </div>
            </div>

            {/* <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Status" />
              <div className="col-span-8 sm:col-span-4 ">
              <span
                className=" mr-2  text-3xl flex justify-end text-center"
               
              >

                {status === "Show" ? (
                  <BsToggleOn  onClick={() => handleChangeStatus(id)} className="base-color cursor-pointer" />
                ) : (
                  <BsToggleOff  onClick={() => handleChangeStatus(id)} className="text-orange-500 cursor-pointer" />
                )}
              </span>
              </div>
            </div> */}
          </div>

          <DrawerButton id={id} title="Banner" />
        </form>
      </Scrollbars>
    </>
  );
};

export default BannerDrawer;
