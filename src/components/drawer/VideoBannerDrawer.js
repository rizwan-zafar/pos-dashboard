import { Scrollbars } from "react-custom-scrollbars-2";
import Error from "../form/Error";
import Title from "../form/Title";
import InputArea from "../form/InputArea";
import LabelArea from "../form/LabelArea";
import DrawerButton from "../form/DrawerButton";
import VideoUploader from "../video-uploader/VideoUploader"; // Custom video uploader component
import useVideoBannerSubmit from "../../hooks/useVideoBannerSubmit"; // Custom hook for video banner submission
import { useEffect } from "react";
import ProductServices from "../../services/ProductServices";
import useAsync from "../../hooks/useAsync";
import { Select } from "@windmill/react-ui";

const VideoBannerDrawer = ({ id }) => {
  const {
    register,
    handleSubmit,
    onSubmit,
    errors,
    videoUrl,
    setVideoUrl,
  } = useVideoBannerSubmit(id);  

  const { data } = useAsync(() => ProductServices._getAllProducts());

  return (
    <>
      <div className="w-full relative p-6 border-b border-gray-100 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {id ? (
          <Title
            title="Update Video-Banner"
            description="Update your video banner from here"
          />
        ) : (
          <Title
            title="Add Video-Banner"
            description="Add your video banner from here"
          />
        )}
      </div>
      <Scrollbars className="w-full md:w-7/12 lg:w-8/12 xl:w-8/12 relative dark:bg-gray-700 dark:text-gray-200">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 flex-grow scrollbar-hide w-full max-h-full pb-40">
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Video Upload" />
              <div className="col-span-8 sm:col-span-4">
                <VideoUploader videoUrl={videoUrl} setVideoUrl={setVideoUrl} />
                <Error errorName={errors.video} />
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
                <Error errorName={errors.title} />
              </div>
            </div>

            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Video Alternate" />
              <div className="col-span-8 sm:col-span-4">
                <InputArea
                  register={register}
                  label="Video Alternate"
                  name="alt"
                  defaultValue=""
                  type="text"
                  placeholder="Enter video alternate text"
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
          </div>

          <DrawerButton id={id} title="Video-Banner" />
        </form>
      </Scrollbars>
    </>
  );
};

export default VideoBannerDrawer;
