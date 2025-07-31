import React, { useContext } from "react";
import { IoMenu } from "react-icons/io5";
import { SidebarContext } from "../../context/SidebarContext";

const Header = () => {
  const { toggleSidebar } = useContext(SidebarContext);

  return (
    <>
      <header className="z-40 py-4 bg-white shadow-sm dark:bg-gray-800">
        <div className="container flex items-center justify-between h-full px-6 mx-auto text-green-500 dark:text-green-500">
          {/* <!-- Mobile hamburger --> */}
          <button
            className="p-1 mr-5 -ml-1 rounded-md lg:hidden focus:outline-none"
            onClick={toggleSidebar}
            aria-label="Menu"
          >
            <IoMenu
              className="w-6 h-6 base-color hover:text-gray-500"
              aria-hidden="true"
            />
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
