import React from "react";
import { Input } from "@windmill/react-ui";

const InputValue = ({ register,required, maxValue, minValue, defaultValue, name, label, type, placeholder , disable }) => {
  const value = {
    valueAsNumber: true,
    required: required ? false : `${label} is required!`,
    // max: {
    //   value: maxValue,
    //   message: `Maximum value ${maxValue}!`,
    // },
    min: {
      value: minValue,
      message: `Minimum value ${minValue}!`,
    },
  };
  return (
    <>
      <Input
        {...register(`${name}`, value)}
        defaultValue={defaultValue}
        type={type}
        placeholder={placeholder}
        name={name}
        min={1}
        disabled={disable}
        className=" border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white   disabled:opacity-75"
      />
      {/* <Input
  {...register(`${name}`, value)}
  defaultValue={defaultValue}
  type={type}
  placeholder={placeholder}
  name={name}
  min={1}
  disabled={disable}
  className={`border h-12 text-sm focus:outline-none block w-full ${
    disable
      ? "opacity-[.2]  "
      : "bg-gray-100 dark:bg-white border-transparent focus:bg-white"
  }`}
/> */}

    </>
  );
};

export default InputValue;
