// import React, { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import Error from "../form/Error";
import Title from "../form/Title";
import InputArea from "../form/InputArea";
import LabelArea from "../form/LabelArea";
import DrawerButton from "../form/DrawerButton";
import Uploader from "../image-uploader/Uploader";
import useCategorySubmit from "../../hooks/useCategorySubmit";
import ReactTagInput from "@pathofdev/react-tag-input";
import { Select, Textarea } from "@windmill/react-ui";
const UserDrawer = ({ id }) => {

  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    imageUrl,
    setImageUrl,
    children,
    setChildren,
  } = useCategorySubmit(id);

  return (
    <>
      <div className="w-full relative p-6  border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            title="Update Vendor"
            description="Updated your Product category and necessary information from here"
          />
        ) : (
          <Title
            title="Add Vendor"
            description=" Add your Product category and necessary information from here"
          />
        )}
      </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 flex-grow scrollbar-hide w-full max-h-full pb-40">
            {/* <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Category Icon" />
              <div className="col-span-8 sm:col-span-4">
                <Uploader imageUrl={imageUrl} setImageUrl={setImageUrl} />
              </div>
            </div> */}

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
                  placeholder="Enater name"
                />
                <Error errorName={errors.type} />
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
                  type="text"
                  placeholder="Enater email"
                />
                <Error errorName={errors.type} />
              </div>
            </div>

            {/* user phone */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Phone" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="phone"
                  name="phone"
                  defaultValue=""
                  type="text"
                  placeholder="Enater email"
                />
                <Error errorName={errors.type} />
              </div>
            </div>

            {/* opening balacnce */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Opening Balance" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Opening Balance"
                  name="opening_balance"
                  defaultValue=""
                  type="text"
                  placeholder="Enater Opening Balance"
                />
                <Error errorName={errors.type} />
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
                  placeholder="Enater NTN"
                />
                <Error errorName={errors.type} />
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
                  placeholder="Enater STRN"
                />
                <Error errorName={errors.type} />
              </div>
            </div>
            {/* user addrss */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Address" />
              <div className="col-span-8 sm:col-span-4">
                <Textarea
                  register={register}
                  label="address"
                  name="address"
                  defaultValue=""
                  type="text"
                  placeholder="Enater Address"
                />
                <Error errorName={errors.type} />
              </div>
            </div>

          </div>

          <DrawerButton id={id} title="Category" />
        </form>
      </Scrollbars>
    </>
  );
};

export default UserDrawer;