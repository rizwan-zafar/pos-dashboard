import React, { useContext } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  Input,
  Card,
  CardBody,
  Pagination,
  Button,
} from "@windmill/react-ui";
import { FiPlus } from "react-icons/fi";
import { FaFilterCircleXmark } from "react-icons/fa6";
import { Select, Textarea } from "@windmill/react-ui";
import useAsync from "../hooks/useAsync";
import useFilter from "../hooks/useFilter";
import NotFound from "../components/table/NotFound";
import UserServices from "../services/UserServices";
import Loading from "../components/preloader/Loading";
import PageTitle from "../components/Typography/PageTitle";
import CustomerTable from "../components/customer/CustomerTable";
import MainDrawer from "../components/drawer/MainDrawer";
import UserDrawer from "../components/drawer/UserDrawer";
import { SidebarContext } from "../context/SidebarContext";

const Customers = () => {
  const { toggleDrawer } = useContext(SidebarContext);
  const { data, loading } = useAsync(UserServices.getAllUsers);
  console.log('Raw data from API:', data);
 
  const {
    userRef,
    searchUser,
    setSearchUser,
    handleChangePage,
    totalResults,
    resultsPerPage,
    dataTable,
    serviceData,
    handleSubmitUser,
  } = useFilter(data);

  const handleClearFilters = () => {
    setSearchUser("");
  };

  return (
    <>
      <PageTitle>Vendors</PageTitle>
      <MainDrawer>
        <UserDrawer />
      </MainDrawer>

      
      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form
            onSubmit={handleSubmitUser}
            className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
          >
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                ref={userRef}
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                type="search"
                name="search"
                placeholder="Search by name/email/phone"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 mt-5 mr-1"
              ></button>
            </div>

            <div
              onClick={handleClearFilters}
              className={` cursor-pointer flex items-center justify-center p-3 rounded-full h-12 w-12 text-center mr-4 text-lg text-blue-600 dark:text-blue-100 bg-blue-100 dark:bg-blue-500`}
            >
              <FaFilterCircleXmark />
            </div>
            <div className="w-full md:w-56 lg:w-56 xl:w-56">
              <Button
                type="button"
                onClick={toggleDrawer}
                className="w-full rounded-md h-12"
              >
                <span className="mr-3">
                  <FiPlus />
                </span>
                Add Vendor
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {loading ? (
        <Loading loading={loading} />
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>ID</TableCell>
                <TableCell>Joining Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                {/* <TableCell className="text-center">ROLE</TableCell> */}
                <TableCell className="text-center">STATUS</TableCell>
                <TableCell className="text-center">SET STATUS</TableCell>
                <TableCell className="text-center">ISVERIFIED</TableCell>
                {/* <TableCell className="text-center">UPDATE VERIFICATION</TableCell> */}

                <TableCell className="text-right">Actions</TableCell>
              </tr>
            </TableHeader>
            <CustomerTable customers={dataTable} />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={handleChangePage}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Customer" />
      )}
    </>
  );
};

export default Customers;
