import { Scrollbars } from "react-custom-scrollbars-2";
import Error from "../form/Error";
import Title from "../form/Title";
import LabelArea from "../form/LabelArea";
import DrawerButton from "../form/DrawerButton";
import Uploader from "../image-uploader/Uploader";
import useUserSubmit from "../../hooks/useUserSubmit";
import { Select, Textarea, Input } from "@windmill/react-ui";

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
            title="Update User"
            description="Update your user information and necessary details from here"
          />
        ) : (
          <Title
            title="Add User"
            description="Add your user information and necessary details from here"
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
                <Input
                  name="name"
                  defaultValue=""
                  type="text"
                  placeholder="Enter name"
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  {...register("name", { required: "Name is required!" })}
                />
                <Error errorName={errors.name} />
              </div>
            </div>

            {/* user role */}
           
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Role" />
              <div className="col-span-8 sm:col-span-4">
                <Select className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white" name="role" {...register("role", {
                  required: "Select User Role!",
                })}>
                  <option value="" hidden>
                    Select Role
                  </option>
                  <option value="vendor">Vendor</option>
                  <option value="customer">Customer</option>
                </Select>
                <Error errorName={errors.role} />
              </div>
            </div>

            {/* user email */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Email" />
              <div className="col-span-8 sm:col-span-4">
                <Input
                  name="email"
                  defaultValue=""
                  type="email"
                  placeholder="Enter email"
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  {...register("email", { 
                    required: "Email is required!",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
                <Error errorName={errors.email} />
              </div>
            </div>

            {/* user phone */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Phone" />
              <div className="col-span-8 sm:col-span-4">
                <Input
                  name="phone"
                  defaultValue=""
                  type="text"
                  placeholder="Enter phone number"
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  {...register("phone", { required: "Phone number is required!" })}
                />
                <Error errorName={errors.phone} />
              </div>
            </div>

            {/* opening balance */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Opening Balance" />
              <div className="col-span-8 sm:col-span-4">
                <Input
                  name="opening_balance"
                  defaultValue=""
                  type="number"
                  placeholder="Enter opening balance"
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  {...register("opening_balance", { required: "Opening balance is required!" })}
                />
                <Error errorName={errors.opening_balance} />
              </div>
            </div>

            {/* User NTN */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="NTN (Optional)" />
              <div className="col-span-8 sm:col-span-4">
                <Input
                  name="ntn"
                  defaultValue=""
                  type="text"
                  placeholder="Enter NTN (optional)"
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  {...register("ntn")}
                />
              </div>
            </div>

            {/* user STRN */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="STRN (Optional)" />
              <div className="col-span-8 sm:col-span-4">
                <Input
                  name="strn"
                  defaultValue=""
                  type="text"
                  placeholder="Enter STRN (optional)"
                  className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                  {...register("strn")}
                /> 
              </div>
            </div>

            {/* user address */}
            <div className="grid grid-cols-6 gap-3 md:gap-5 xl:gap-6 lg:gap-6 mb-6">
              <LabelArea label="Address" />
              <div className="col-span-8 sm:col-span-4">
                <Textarea
                  {...register("address", { required: "Address is required!" })}
                  className="w-full px-3 py-3 text-gray-500 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:border-gray-500 dark:text-gray-300 dark:border-gray-600 dark:focus:border-gray-500"
                  placeholder="Enter address"
                  rows="4"
                />
                <Error errorName={errors.address} />
              </div>
            </div>
          </div>

          <DrawerButton id={id} title="User" />
        </form>
      </Scrollbars>
    </>
  );
};

export default UserDrawer;