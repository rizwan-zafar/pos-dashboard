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
  Select,
  CardBody,
  Pagination,
} from "@windmill/react-ui";
import { FiPlus } from "react-icons/fi";
import useAsync from "../hooks/useAsync";
import NotFound from "../components/table/NotFound";
import Loading from "../components/preloader/Loading";
import ProductServices from "../services/ProductServices";
import { SidebarContext } from "../context/SidebarContext";
import ProductTable from "../components/product/ProductTable";
import SelectCategory from "../components/form/SelectCategory";
import MainDrawer from "../components/drawer/MainDrawer";
import ProductDrawer from "../components/drawer/ProductDrawer";
import { FaFilterCircleXmark } from "react-icons/fa6";
import PageTitle from "../components/Typography/PageTitle";
import CategoryServices from "../services/CategoryServices";

const Products = () => {
  const {
    toggleDrawer,
    // handleChangePage,
    searchRef,
    handleSubmitForAll,
  } = useContext(SidebarContext);

  // Add state for child category filtering
  const [availableChildCategories, setAvailableChildCategories] = React.useState([]);

  // Fetch all products first, then apply client-side filtering
  const { data, loading } = useAsync(() => ProductServices.getAllProducts());

  // Fetch categories to get child categories for the selected parent
  const { data: categories } = useAsync(CategoryServices.getAllCategory);

  // Temporary: Direct data access without useFilter hook
  const products = React.useMemo(() => data?.products || [], [data?.products]);
  const [searchText, setSearchText] = React.useState("");
  const [categoryType, setCategoryType] = React.useState("All");
  const [childCategory, setChildCategory] = React.useState("");

  // Filter products based on search text and category
  const filteredProducts = React.useMemo(() => {
    let filtered = products;
    
    // Category filtering
    if (categoryType && categoryType !== "All") {
      // Find the category ID that matches the selected category name
      const selectedCategory = categories?.find(cat => cat.name === categoryType);
      
      if (selectedCategory) {
        // Filter products by category_id
        filtered = filtered.filter(product => {
          const productCategoryId = product?.category_id;
          return productCategoryId === selectedCategory.id;
        });
      }
    }
    
    // Child category filtering
    if (childCategory && childCategory !== "") {
      filtered = filtered.filter(product => {
        // Since children is a string (not an array), compare directly
        const productChild = product?.children;
        return productChild && productChild.toLowerCase() === childCategory.toLowerCase();
      });
    }
    
    // Search text filtering
    if (searchText) {
      filtered = filtered.filter(product => 
        product && (
          (product.title && product.title.toLowerCase().includes(searchText.toLowerCase())) ||
          (product.productCode && product.productCode.toLowerCase().includes(searchText.toLowerCase())) ||
          (product.name && product.name.toLowerCase().includes(searchText.toLowerCase()))
        )
      );
    }
    
    return filtered;
  }, [products, categoryType, childCategory, searchText, categories]);

  // Debug logging - only essential info
  console.log("Products - filtered count:", filteredProducts.length);
  console.log("Products - category:", categoryType);
  console.log("Products - child category:", childCategory);
  console.log("Products - search:", searchText);
  
  // Inspect first product structure only when needed
  if (products.length > 0 && !filteredProducts.length) {
    console.log("=== DEBUG: First product children field ===");
    console.log("Product:", products[0]?.title);
    console.log("Children field:", products[0]?.children);
    console.log("Children type:", typeof products[0]?.children);
    console.log("=== END DEBUG ===");
  }

  // Update available child categories when parent category changes
  React.useEffect(() => {
    if (categoryType && categoryType !== "All" && categories) {
      const selectedParent = categories.find(cat => cat.name === categoryType);
      
      if (selectedParent && selectedParent.children) {
        try {
          const children = JSON.parse(selectedParent.children);
          setAvailableChildCategories(children);
        } catch (error) {
          console.error("Failed to parse children:", error);
          setAvailableChildCategories([]);
        }
      } else {
        setAvailableChildCategories([]);
      }
      // Reset child category when parent changes
      setChildCategory("");
    } else {
      setAvailableChildCategories([]);
      setChildCategory("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryType, categories]); // Removed setChildCategory from dependencies

  // function to clear filters
  const handleClearFilters = () => {
    // console.log("Clearing filters");
    setCategoryType("All");
    setChildCategory("");
    setSearchText("");
  };

  return (
    <>
      <MainDrawer>
        <ProductDrawer />
      </MainDrawer>
      <PageTitle>Products</PageTitle>
      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form
            onSubmit={handleSubmitForAll}
            className="py-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-4 lg:gap-6 xl:gap-6 items-end"
          >
            {/* Search Input */}
            <div className="sm:col-span-2 lg:col-span-2 xl:col-span-2">
              <Input
                ref={searchRef}
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                type="search"
                name="search"
                value={searchText || ""}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by product name"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 mt-5 mr-1"
              ></button>
            </div>
            {/* Parent Category */}
            <div>
              <SelectCategory setCategory={setCategoryType} />
            </div>
            {/* Child Category */}
            <div>
              <Select
                value={childCategory}
                onChange={(e) => setChildCategory(e.target.value)}
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white"
                disabled={!categoryType || categoryType === "All" || availableChildCategories.length === 0}
              >
                <option value="" hidden>
                  Child Category
                </option>
                {availableChildCategories.length > 0 ? (
                  availableChildCategories.map((child, i) => (
                    <option key={i} value={child}>
                      {child}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    {!categoryType || categoryType === "All" ? "Select Parent Category First" : "No Child Categories Available"}
                  </option>
                )}
              </Select>
            </div>

            {/* Clear Filters Button */}
            <div
              onClick={handleClearFilters}
              className={`cursor-pointer flex items-center justify-center p-3 rounded-full h-12 w-12 text-center transition-all duration-200 ${
                (searchText || categoryType !== "All" || (childCategory && childCategory !== ""))
                  ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40' 
                  : 'text-blue-600 dark:text-blue-100 bg-blue-100 dark:bg-blue-500'
              }`}
              title="Clear all filters"
            >
              <FaFilterCircleXmark />
            </div>

            {/* Add Product Button */}
            <div>
              <Button onClick={toggleDrawer} className="w-full rounded-md h-12">
                <span className="mr-3">
                  <FiPlus />
                </span>
                Add Product
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Filter Summary */}
      {(searchText || categoryType !== "All" || (childCategory && childCategory !== "")) && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-700 dark:text-gray-300">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-blue-700 dark:text-blue-300">Active Filters:</span>
              {searchText && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                  Search: "{searchText}"
                  <button
                    onClick={() => setSearchText("")}
                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-700"
                  >
                    ×
                  </button>
                </span>
              )}
              {categoryType !== "All" && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                  Category: {categoryType}
                  <button
                    onClick={() => setCategoryType("All")}
                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-700"
                  >
                    ×
                  </button>
                </span>
              )}
              {childCategory && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                  Child Category: {childCategory}
                  <button
                    onClick={() => setChildCategory("")}
                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-700"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              {filteredProducts.length || 0} of {products.length || 0} products
            </span>
          </div>
        </div>
      )}

      {loading ? (
        <Loading loading={loading} />
      ) : (filteredProducts && filteredProducts.length > 0) ? (
        <TableContainer className="mb-8 rounded-b-lg">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>IMAGES</TableCell>
                <TableCell>PRODUCT CODE</TableCell>
                <TableCell>NAME</TableCell>
                <TableCell>CATEGORY</TableCell>
                <TableCell>CHILD CATEGORY</TableCell>
                <TableCell>SIZES</TableCell>
                <TableCell>PRICE ($)</TableCell>
                <TableCell>PROMO PRICE ($)</TableCell>
                <TableCell>BRAND</TableCell>
                <TableCell>DELIVER CHARGES</TableCell>
                <TableCell className="text-center">VIEW</TableCell>
                <TableCell className="text-center">ENABLES</TableCell>
                <TableCell className="text-center">Actions</TableCell>
              </tr>
            </TableHeader>
            <ProductTable products={filteredProducts || []} />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={filteredProducts.length || 0}
              resultsPerPage={10}
              onChange={() => {}}
              label="Product Page Navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Product" />
      )}
    </>
  );
};

export default Products;
