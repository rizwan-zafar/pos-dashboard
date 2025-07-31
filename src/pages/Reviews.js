import React, { useContext } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  //   Button,
  Card,
  CardBody,
  Pagination,
  Input,
} from "@windmill/react-ui";
// import { FiPlus } from "react-icons/fi";
import useAsync from "../hooks/useAsync";
import useFilter from "../hooks/useFilter";
import NotFound from "../components/table/NotFound";
import Loading from "../components/preloader/Loading";
import { SidebarContext } from "../context/SidebarContext";
import ReviewServices from "../services/ReviewServices";
import ReviewTable from "../components/review/ReviewTable";
import PageTitle from "../components/Typography/PageTitle";
import { FaFilterCircleXmark } from "react-icons/fa6";

const Reviews = () => {
  //   const { toggleDrawer, handleChangePage, handleSubmitForAll } =
  //     useContext(SidebarContext);

  const { data, loading } = useAsync(() => ReviewServices.getAllReviews(), []);

  //   const { serviceData } = useFilter(data);
  //   console.log(data);

  const {
    reviewRef,
    setFilter,
    handleChangePage,
    totalResults,
    resultsPerPage,
    dataTable,
    serviceData,
    reviewType,
    setReviewType,
    handleSubmitReview,
  } = useFilter(data);

 const handleClearFilters = () => {
    setReviewType("");
    setFilter("");
  };
  return (
    <>
      {/* <MainDrawer>
        <BannerDrawer />
      </MainDrawer> */}
      <PageTitle>Reviews</PageTitle>

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form
            onSubmit={handleSubmitReview}
            className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
          >
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                ref={reviewRef}
                value={reviewType}
                onChange={(e) => setReviewType(e.target.value)}
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                type="search"
                name="search"
                placeholder="Search by product name/username/title/ratings(1-5)"
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
          </form>
        </CardBody>
      </Card>

      {loading ? (
        <Loading loading={loading} />
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8 rounded-b-lg">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>ID</TableCell>
                <TableCell>USERNAME</TableCell>
                <TableCell>PRODUCT</TableCell>
                <TableCell>RATINGS</TableCell>
                <TableCell>TITLE</TableCell>
                <TableCell>MESSAGE</TableCell>
                <TableCell>DATET</TableCell>
                <TableCell>STATUS</TableCell>
                {/* <TableCell className="text-center">VIEW</TableCell> */}
                <TableCell className="text-center">ENABLES</TableCell>
                <TableCell className="text-right">Actions</TableCell>
              </tr>
            </TableHeader>
            {/* <ReviewTable reviews={data} /> */}
            <ReviewTable reviews={dataTable} />
          </Table>
          <TableFooter>
            <Pagination
              //   totalResults={data?.totalDoc}
              totalResults={totalResults}
              //   resultsPerPage={15}
              resultsPerPage={resultsPerPage}
              onChange={handleChangePage}
              label="Reviews Page Navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Reviews" />
      )}
    </>
  );
};

export default Reviews;
