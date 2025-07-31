import React, { useContext } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  Card,
  CardBody,
  Pagination,
  Input,
} from "@windmill/react-ui";
import useAsync from "../hooks/useAsync";
import useFilter from "../hooks/useFilter";
import NotFound from "../components/table/NotFound";
import OrderServices from "../services/OrderServices";
import Loading from "../components/preloader/Loading";
import OrderTable from "../components/order/OrderTable";
import { SidebarContext } from "../context/SidebarContext";
import PageTitle from "../components/Typography/PageTitle";

const Orders = () => {
  const {
    time,
    currentPage,
    status,
    searchText,
    // handleChangePage,
    handleSubmitForAll,
    // resultsPerPage,
  } = useContext(SidebarContext);

  const { data, loading } = useAsync(() =>
    OrderServices.getAllOrders({
      contact: searchText,
      status,
      page: currentPage,
      limit: resultsPerPage,
      day: time,
    })
  );

  const { 
     orderRef,
    setFilter,
    handleChangePage,
    totalResults,
    resultsPerPage,
    dataTable,
    serviceData,
    orderType,
    setOrderType,
    handleSubmitOrder,
  } = useFilter(data.orders);

  // console.log('>>>>>>>>>>>>. dataTable', dataTable)

  // const totalSum =
  //   dataTable?.reduce((acc, item) => acc + item.totalPrice, 0) || 0;

  const totalSum =
    data?.orders?.reduce((acc, item) => acc + item.totalPrice, 0) || 0;


  return (
    <>
      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form
            onSubmit={handleSubmitOrder}
            className="py-3 justify-between grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex flex-col"
          >
            <div className="flex justify-between">
              <h1 className="text-slate-600 text-2xl font-bold">Orders</h1>
              <h1 className="base-color text-xl font-bold">
                Total Value: $ {totalSum}
              </h1>
            </div>
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                ref={orderRef}
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                type="search"
                name="search"
                placeholder="Search by Order Id"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 mt-5 mr-1"
              ></button>
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
                <TableCell>ORDER NUMBER</TableCell>
                <TableCell>PRODUCTS</TableCell>
                <TableCell>PRICE</TableCell>
                <TableCell>CUSTOMER Phone</TableCell>
                <TableCell>CUSTOMER EMAIL</TableCell>
                <TableCell className="text-center">STATUS</TableCell>
                <TableCell className="text-center">SET STATUS</TableCell>
                <TableCell className="text-center">View</TableCell>
                <TableCell className="text-center">Actions</TableCell>
              </tr>
            </TableHeader>
            <OrderTable orders={dataTable} />
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
        <NotFound title="Order" />
      )}
    </>
  );
};

export default Orders;
