import React, { useContext, useState } from "react";
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
  Button,
} from "@windmill/react-ui";
import useAsync from "../hooks/useAsync";

import NotFound from "../components/table/NotFound";
import OrderServices from "../services/OrderServices";
import Loading from "../components/preloader/Loading";
import OrderTable from "../components/order/OrderTable";
import OrderDrawer from "../components/drawer/OrderDrawer";
import MainDrawer from "../components/drawer/MainDrawer";
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

  // Debug: Log the API call parameters
  console.log("🔍 Orders.js - API Call Parameters:", {
    contact: searchText,
    status,
    page: currentPage,
    limit: 8, // Hardcoded limit for now
    day: time,
  });

  const { data, loading, refetch } = useAsync(() =>
    OrderServices.getAllOrders({
      contact: searchText,
      status,
      page: currentPage,
      limit: 8, // Hardcoded limit for now
      day: time,
    })
  );

  // Local state for orders to ensure immediate updates
  const [localOrders, setLocalOrders] = useState([]);

  // Update local orders when API data changes
  React.useEffect(() => {
    if (data?.orders) {
      setLocalOrders(data.orders);
    }
  }, [data?.orders]);

  // Manual refresh function as backup
  const manualRefresh = async () => {
    console.log("🔍 Manual refresh triggered");
    try {
      const newData = await OrderServices.getAllOrders({
        contact: searchText,
        status,
        page: currentPage,
        limit: 8,
        day: time,
      });
      console.log("🔍 Manual refresh successful:", newData);
      if (newData?.orders) {
        setLocalOrders(newData.orders);
      }
    } catch (error) {
      console.error("🔍 Manual refresh failed:", error);
    }
  };

  // Debug: Log the API response
  console.log("🔍 Orders.js - API Response:", {
    data,
    loading,
    dataType: typeof data,
    hasOrders: !!data?.orders,
    ordersLength: data?.orders?.length,
    ordersType: typeof data?.orders,
  });

  // Debug: Log what's being passed to useFilter
  console.log("🔍 Orders.js - Data passed to useFilter:", {
    dataOrders: data?.orders,
    dataOrdersType: typeof data?.orders,
    dataOrdersLength: data?.orders?.length,
  });

  // Simple orders handling - bypass useFilter complexity
  const orders = localOrders || [];
  const [currentOrdersPage, setCurrentOrdersPage] = useState(1);
  const [orderType, setOrderType] = useState("");
  const ordersPerPage = 8;

  // Drawer state
  const { isDrawerOpen, closeDrawer, toggleDrawer } = useContext(SidebarContext);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Pagination for orders
  const totalResults = orders.length;
  const startIndex = (currentOrdersPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const dataTable = orders.slice(startIndex, endIndex);
  
  const handleChangePage = (page) => {
    setCurrentOrdersPage(page);
  };

  // Drawer handlers
  const openAddOrderDrawer = () => {
    setSelectedOrder(null);
    toggleDrawer();
  };

  const openEditOrderDrawer = (order) => {
    setSelectedOrder(order);
    toggleDrawer();
  };

  const handleCloseDrawer = () => {
    closeDrawer();
    setSelectedOrder(null);
  };

  const handleOrderSuccess = async (newOrderData = null) => {
    console.log("🔍 handleOrderSuccess called - refreshing orders data");
    
    // If we have new order data, add it to local state immediately
    if (newOrderData) {
      console.log("🔍 Adding new order to local state:", newOrderData);
      
      // Ensure the new order has the proper structure that OrderTable expects
      const structuredOrder = {
        ...newOrderData,
        // Ensure user object exists with required properties
        user: {
          phone: newOrderData.reciever_contact || newOrderData.user?.phone || "N/A",
          email: newOrderData.user?.email || "N/A",
          name: newOrderData.reciever_name || newOrderData.user?.name || "N/A"
        },
        // Ensure items array exists and has proper structure
        items: newOrderData.items ? 
          (typeof newOrderData.items === 'string' ? JSON.parse(newOrderData.items) : newOrderData.items)
          : [],
        // Ensure other required properties
        totalPrice: newOrderData.totalPrice || 0,
        status: newOrderData.status || "Pending"
      };
      
      console.log("🔍 Structured order for local state:", structuredOrder);
      setLocalOrders(prevOrders => [structuredOrder, ...prevOrders]);
    }
    
    // Try refetch first
    if (refetch) {
      try {
        console.log("🔍 Calling refetch()...");
        await refetch();
        console.log("🔍 refetch() completed successfully");
        
        // Also try manual refresh as backup
        setTimeout(() => {
          manualRefresh();
        }, 500);
        
      } catch (error) {
        console.error("🔍 Error during refetch:", error);
        // Fallback: use manual refresh
        manualRefresh();
      }
    } else {
      console.log("🔍 refetch function not available, using manual refresh");
      manualRefresh();
    }
  };

  // Debug: Log simple orders handling
  console.log("🔍 Orders.js - Simple Orders Handling:", {
    orders,
    ordersLength: orders?.length,
    currentPage: currentOrdersPage,
    dataTable,
    dataTableLength: dataTable?.length,
    startIndex,
    endIndex,
  });

  const totalSum =
    data?.orders?.reduce((acc, item) => acc + item.totalPrice, 0) || 0;


  return (
    <>
      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <div className="py-3 justify-between grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex flex-col">
            <div className="flex justify-between items-center">
              <h1 className="text-slate-600 text-2xl font-bold">Orders</h1>
              <div className="flex items-center gap-4">
                <h1 className="base-color text-xl font-bold">
                  Total Value: $ {totalSum}
                </h1>
                <Button
                  onClick={openAddOrderDrawer}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  + Add Order
                </Button>
              </div>
            </div>
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                value={orderType || ""}
                onChange={(e) => setOrderType(e.target.value)}
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                type="search"
                name="search"
                placeholder="Search by Order Id"
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {loading ? (
        <Loading loading={loading} />
      ) : dataTable?.length > 0 ? (
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
              resultsPerPage={ordersPerPage}
              onChange={handleChangePage}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Order" />
      )}

      {/* Order Drawer */}
      <MainDrawer>
        <OrderDrawer
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          orderData={selectedOrder}
          onSuccess={handleOrderSuccess}
        />
      </MainDrawer>
    </>
  );
};

export default Orders;
