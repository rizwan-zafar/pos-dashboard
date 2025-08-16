import React, { useContext } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  Button,
  Input,
  Card,
  CardBody,
  Pagination,
} from "@windmill/react-ui";
import { FiPlus } from "react-icons/fi";

import useAsync from "../hooks/useAsync";
import NotFound from "../components/table/NotFound";
import Loading from "../components/preloader/Loading";
import { SidebarContext } from "../context/SidebarContext";
import PageTitle from "../components/Typography/PageTitle";
import CategoryServices from "../services/CategoryServices";
import CategoryTable from "../components/category/CategoryTable"; 
import MainDrawer from "../components/drawer/MainDrawer";
import CategoryDrawer from "../components/drawer/CategoryDrawer";
import { FaFilterCircleXmark } from "react-icons/fa6";

const Category = () => {
  const { toggleDrawer } = useContext(SidebarContext);
  const { data, loading } = useAsync(CategoryServices.getAllCategory);
  
  // Use separate search state instead of categoryType for the search input
  const [searchText, setSearchText] = React.useState("");
  
  // Extract categories array from the API response
  const categories = React.useMemo(() => {
    if (data?.categories) return data.categories;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  // Use local state for filtering and pagination
  const [currentPage, setCurrentPage] = React.useState(1);
  const resultsPerPage = 8;

  // Filter categories based on search text
  const filteredCategories = React.useMemo(() => {
    if (!searchText) return categories;
    
    return categories.filter(category => 
      category.name?.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [categories, searchText]);

  // Pagination
  const totalResults = filteredCategories.length;
  const dataTable = React.useMemo(() => {
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return filteredCategories.slice(startIndex, endIndex);
  }, [filteredCategories, currentPage, resultsPerPage]);

  const handleChangePage = (p) => {
    setCurrentPage(p);
  };

  const handleClearFilters = () => {
    setSearchText("");
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by the filteredCategories useMemo
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <>
      <PageTitle>Category</PageTitle>

      <MainDrawer>
        <CategoryDrawer />
      </MainDrawer>

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form
            onSubmit={handleSearch}
            className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
          >
            <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
              <Input
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                type="search"
                name="search"
                placeholder="Search by category name"
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
                Add Category
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {loading ? (
        <Loading loading={loading} />
      ) : totalResults !== 0 ? (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>NAME</TableCell>
                <TableCell>IMAGE</TableCell>
                <TableCell>CHILD CATEGORIES</TableCell>
                <TableCell>NUMBER OF PRODUCTS</TableCell>
                <TableCell>ENABLE</TableCell>
                <TableCell className="text-right">Actions</TableCell>
              </tr>
            </TableHeader>
            <CategoryTable categories={dataTable} />
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
        <NotFound title="Category" />
      )}
    </>
  );
};

export default Category;
