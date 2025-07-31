import React, { useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import { Select, Textarea } from "@windmill/react-ui";
import Title from "../form/Title";
import Error from "../form/Error";
import LabelArea from "../form/LabelArea";
import InputArea from "../form/InputArea";
import DrawerButton from "../form/DrawerButton";
import useProductSubmit from "../../hooks/useProductSubmit";
import useAsync from "../../hooks/useAsync";
import ReactStars from "react-stars";
import UserServices from "../../services/UserServices";
import useReviewSubmit from "../../hooks/useReviewSubmit";

const ReviewDrawer = ({ id , setAddReview}) => {
  
    
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    productCode,
    setValue,
    watch,
    isDrawerOpen,
  } = useReviewSubmit(id);

  const { data } = useAsync(UserServices.getAllUsers);
  const [rating, setRating] = React.useState(0);
  // console.log(variations);

  useEffect(() => {
    if (isDrawerOpen && !id && productCode) {
      setValue("productCode", productCode);
    }
  }, [isDrawerOpen, productCode, id, setValue]);


  //////// if selected, set user as reviewer 
  useEffect(() => {
  const selectedUserId = watch("userId"); 
  const selectedUser = data?.find((user) => user.id === Number(selectedUserId));
// console.log(data);

  if (selectedUser) {
    setValue("reviewerName", selectedUser.name); 
  } else {
    setValue("reviewerName", ""); 
  }
}, [watch("userId"), data, setValue]);



/////////// ratings
  const ratingChanged = (newRating) => {
    setRating(newRating);
  };

  return (
    <>
      <div className="w-full relative p-6  border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <Title
          title="Add Review"
          description="Add product reviews and ratings from here"
        />
      </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form
          onSubmit={handleSubmit((data) => {
            onSubmit({ ...data, rating });
          })}
          className="block"
        >
          <div className="px-6 pt-8 flex-grow w-full h-full max-h-full pb-40 md:pb-32 lg:pb-32 xl:pb-32">

             <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="User" />
              <div className="col-span-8 sm:col-span-4">
                <Select
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  name="userId"
                  {...register("userId")}
                >
                  <option value="" hidden>
                    Select User
                  </option>
                  {data?.map((user) => (
                    <option key={`${user.id}`} value={user.id}>
                      {user?.name}
                    </option>
                  ))}
                </Select>
                <Error errorName={errors.userId} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Reviewer" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Reviewer"
                  name="reviewerName"
                  type="text"
                  placeholder="Enter Reviewer Name"
                  defaultValue={watch("reviewerName")}
                />
                <Error errorName={errors.reviewerName} />
              </div>
            </div>
          

  <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Rating" />
              <div className="col-span-8 sm:col-span-4">
                <ReactStars
                  count={5}
                  onChange={ratingChanged}
                  size={24}
                  half={false}
                  value={rating}
                  color2={"#ffd700"} // Star color
                />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Title" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Title"
                  name="title"
                  type="text"
                  placeholder="Enter Title"
                />
                <Error errorName={errors.title} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Message" />
              <div className="col-span-8 sm:col-span-4">
                <Textarea
                  className="border text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                  {...register("message", {
                    // required: "Description is required!",
                    minLength: {
                      value: 10,
                      message: "Minimum 10 character!",
                    },
                  })}
                  name="message"
                  placeholder="Message"
                  rows="4"
                  spellCheck="false"
                  //   value={watch("message") || ""} // Ensure it's never null
                />
                <Error errorName={errors.description} />
              </div>
            </div>

          

           </div>

          <DrawerButton id={id} title="Review" setAddReview={setAddReview} />
        </form>
      </Scrollbars>
    </>
  );
};

export default React.memo(ReviewDrawer);
