// import React, { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import Error from "../form/Error";
import Title from "../form/Title";
import InputArea from "../form/InputArea";
import LabelArea from "../form/LabelArea";
import DrawerButton from "../form/DrawerButton";
import Uploader from "../image-uploader/Uploader";
import useUserSubmit from "../../hooks/useUserSubmit";
import ReactTagInput from "@pathofdev/react-tag-input";
import { Select, Textarea } from "@windmill/react-ui";

const UserDrawer = ({ id }) => {
  const {
    register,
    handleSubmit,
    onSubmit,
    imageUrl,
    setImageUrl,
    errors,
  } = useUserSubmit(id);

  return (
    <>
      <div className="w-full relative p-6  border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            title="Update Vendor"
            description="Update your vendor information and necessary details from here"
          />
        ) : (
          <Title
            title="Add Vendor"
            description="Add your vendor information and necessary details from here"
          />
        )}
      </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 flex-grow scrollbar-hide w-full max-h-full pb-40">

            {/* user image */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="User Image" />
              <div className="col-span-8 sm:col-span-4">
                <Uploader imageUrl={imageUrl} setImageUrl={setImageUrl} />
              </div>
            </div>


            {/* user name */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Name" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Name"
                  name="name"
                  defaultValue=""
                  type="text"
                  placeholder="Enter name"
                />
                <Error errorName={errors.name} />
              </div>
            </div>

            {/* user email */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Email" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Email"
                  name="email"
                  defaultValue=""
                  type="email"
                  placeholder="Enter email"
                />
                <Error errorName={errors.email} />
              </div>
            </div>

            {/* user phone */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Phone" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Phone"
                  name="phone"
                  defaultValue=""
                  type="text"
                  placeholder="Enter phone number"
                />
                <Error errorName={errors.phone} />
              </div>
            </div>

            {/* opening balance */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Opening Balance" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Opening Balance"
                  name="opening_balance"
                  defaultValue=""
                  type="number"
                  placeholder="Enter opening balance"
                />
                <Error errorName={errors.opening_balance} />
              </div>
            </div>

            {/* User NTN */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="NTN" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="NTN"
                  name="ntn"
                  defaultValue=""
                  type="text"
                  placeholder="Enter NTN"
                />
                <Error errorName={errors.ntn} />
              </div>
            </div>

            {/* user STRN */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="STRN" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="STRN"
                  name="strn"
                  defaultValue=""
                  type="text"
                  placeholder="Enter STRN"
                />
                <Error errorName={errors.strn} />
              </div>
            </div>

            {/* user address */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Address" />
              <div className="col-span-8 sm:col-span-4">
                <Textarea
                  {...register("address")}
                  className="w-full px-3 py-3 text-gray-500 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 dark:text-gray-300 dark:border-gray-600 dark:focus:border-gray-500"
                  placeholder="Enter address"
                  rows="4"
                />
                <Error errorName={errors.address} />
              </div>
            </div>
          </div>

          <DrawerButton id={id} title="Vendor" />
        </form>
      </Scrollbars>
    </>
  );
};

export default UserDrawer;