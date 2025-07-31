import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@windmill/react-ui";
import Error from "../components/form/Error";
import LabelArea from "../components/form/LabelArea";
import InputArea from "../components/form/InputArea";
import ImageLight from "../assets/img/login.png";
import useLoginSubmit from "../hooks/useLoginSubmit";

const Login = () => {
  const { onSubmit, register, handleSubmit, errors, loading } =
    useLoginSubmit();

  return (
    <>
      <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
          <div className="flex flex-col overflow-y-auto md:flex-row">
            <div className="h-32 md:h-auto md:w-1/2">
              <img
                aria-hidden="true"
                className="object-cover w-full h-full dark:hidden"
                src={ImageLight}
                alt="Office"
              />
             
            </div>
            <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              <div className="w-full">
                <h1 className="mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                  Login
                </h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <LabelArea label="Email" />
                  <InputArea
                    register={register}
                    defaultValue=""
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="john@doe.com"
                  />
                  <Error errorName={errors.email} />
                  <div className="mt-6"></div>
                  <LabelArea label="Password" />
                  <InputArea
                    register={register}
                    defaultValue=""
                    label="Password" 
                    name="password"
                    type="password"
                    placeholder="***************"
                  />
                  <Error errorName={errors.password} />

                  <Button
                    disabled={loading}
                    type="submit"
                    className="mt-4 h-12 w-full base-bg-color"
                    to="/dashboard"
                  >
                    Log in
                  </Button>
                  <hr className="my-10" />
                 
                </form>

                <p className="mt-4">
                  <Link
                    className="text-sm font-medium  hover:underline"
                    style={{ color: "#68CC58" }}
                    to="/forgot-password"
                  >
                    Forgot your password?
                  </Link>
                </p>
                
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
