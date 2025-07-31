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
} from "@windmill/react-ui";

import useAsync from "../hooks/useAsync";
import useFilter from "../hooks/useFilter";
import NotFound from "../components/table/NotFound";
import Loading from "../components/preloader/Loading";
import PageTitle from "../components/Typography/PageTitle";
import SubscriptionTable from "../components/subscription/SubscriptionTable";
import { SidebarContext } from "../context/SidebarContext";
import MessageServices from "../services/MessageServices";
import MessageTable from "../components/message/MessageTable";

const Messages = () => {

     const { data, loading } = useAsync(MessageServices.getAllMessages);

  const {
    messageRef,
    handleChangePage,
    totalResults,
    resultsPerPage,
    dataTable,
    serviceData,
    messageType,
    setMessageType,
    handleSubmiMessage,
  } = useFilter(data);

  return (
    <>
      <PageTitle>Messages</PageTitle>
      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form
            onSubmit={handleSubmiMessage}
            className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
          >
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                ref={messageRef}
                value={messageType}
                onChange={(e) => setMessageType(e.target.value)}
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                type="search"
                name="search"
                placeholder="Search by email/status"
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
                <TableCell>ID</TableCell>
                <TableCell>MESSAGE</TableCell>
                <TableCell>FULLNAME</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>PHONE</TableCell>
                <TableCell> DATE</TableCell>
                <TableCell>STATUS</TableCell>
                <TableCell  >SET STATUS</TableCell>
                <TableCell className="text-center">ACTIONS</TableCell>
              </tr>
            </TableHeader>
            <MessageTable messages={dataTable} />
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
        <NotFound title="Messages" />
      )}
    </>
  );
};


export default Messages
