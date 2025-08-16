import React from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  Pagination,
  CardBody,
  Card,
  Input,
} from "@windmill/react-ui";
import { IoBagHandle } from "react-icons/io5";

import useAsync from "../hooks/useAsync";
import useFilter from "../hooks/useFilter";
import OrderServices from "../services/OrderServices";
import Loading from "../components/preloader/Loading";
import UserOrderTable from "../components/user/UserOrderTable";
import PageTitle from "../components/Typography/PageTitle";

const UserOrder = () => {
  const { id } = useParams();

  const { data, loading, error } = useAsync(() =>
    OrderServices.getOrderByUser(id)
  );

  const {
    customerOrderRef,
    serviceData,
    customerOrderType,
    setCustomerOrderType,
    handleSubmitCustomerOrder,
    handleChangePage,
    totalResults,
    resultsPerPage,
    dataTable,
  } = useFilter(data);

  return (
    <>
      <PageTitle>User Order List</PageTitle>

      {loading && <Loading loading={loading} />}
      {!error && !loading && dataTable.length === 0 && (
        <div className="w-full bg-white rounded-md dark:bg-gray-800">
          <div className="p-8 text-center">
            <span className="flex justify-center my-30 text-red-500 font-semibold text-6xl">
              <IoBagHandle />
            </span>
            <h2 className="font-medium text-base mt-4 text-gray-600">
              This User have no order Yet!
            </h2>
          </div>
        </div>
      )}

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form
            onSubmit={handleSubmitCustomerOrder}
            className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
          >
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                ref={customerOrderRef}
                value={customerOrderType}
                onChange={(e) => setCustomerOrderType(e.target.value)}
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                type="search"
                name="search"
                placeholder="Search by order id"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 mt-5 mr-1"
              ></button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* {data.length > 0 && !error && !loading ? ( */}
      {serviceData?.length > 0  && !error && !loading ? (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Order ID</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Shipping Address</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell className="text-center">Status</TableCell>
                <TableCell className="text-center">Actions</TableCell>
              </tr>
            </TableHeader>
            <UserOrderTable orders={dataTable} />
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
      ) : null}
    </>
  );
};

export default UserOrder;
