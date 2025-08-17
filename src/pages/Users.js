import React, { useContext, useState } from "react";
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
  Select,
} from "@windmill/react-ui";
import { FiPlus } from "react-icons/fi";
import { FaFilterCircleXmark } from "react-icons/fa6";
import useAsync from "../hooks/useAsync";
import NotFound from "../components/table/NotFound";
import UserServices from "../services/UserServices";
import Loading from "../components/preloader/Loading";
import PageTitle from "../components/Typography/PageTitle";
import UserTable from "../components/user/UserTable";
import MainDrawer from "../components/drawer/MainDrawer";
import UserDrawer from "../components/drawer/UserDrawer";
import { SidebarContext } from "../context/SidebarContext";

const Users = () => {
  const { toggleDrawer } = useContext(SidebarContext);
  const [editingUserId, setEditingUserId] = useState(null);

  const { data, loading } = useAsync(() => UserServices.getAllUsers());

  // Extract users array from the API response, similar to how products work
  const users = React.useMemo(() => {
    // Handle different possible response structures
    if (data?.users) return data.users;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  // Use local state for filtering instead of useFilter hook for better control
  const [searchUser, setSearchUser] = React.useState("");
  const [role, setRole] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const resultsPerPage = 8;

  // Filter users based on search and role
  const filteredUsers = React.useMemo(() => {
    let filtered = users;
    
    // Role filtering
    if (role) {
      filtered = filtered.filter(user => user.role === role);
    }
    
    // Search filtering
    if (searchUser) {
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(searchUser.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchUser.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchUser.toLowerCase())
      );
    }
    
    return filtered;
  }, [users, role, searchUser]);

  // Pagination
  const totalResults = filteredUsers.length;
  const dataTable = React.useMemo(() => {
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, resultsPerPage]);

  const handleChangePage = (p) => {
    setCurrentPage(p);
  };

  const handleClearFilters = () => {
    setSearchUser("");
    setRole("");
    setCurrentPage(1);
  };

  const handleEditUser = (userId) => {
    setEditingUserId(userId);
    toggleDrawer();
  };

  const handleAddUser = () => {
    setEditingUserId(null);
    toggleDrawer();
  };

  return (
    <>
      <PageTitle>Users</PageTitle>
      <MainDrawer>
        <UserDrawer id={editingUserId} />
      </MainDrawer>

      
      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <div className="py-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 xl:gap-6">
            {/* Search Input */}
            <div className="sm:col-span-2 lg:col-span-2 xl:col-span-2">
              <Input
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                className="border h-12 text-sm focus:outline-none block w-full bg-gray-100 border-transparent focus:bg-white"
                type="search"
                name="search"
                placeholder="Search by name/email/phone"
              />
            </div>

            {/* Role Filter */}
            <div className="sm:col-span-1 lg:col-span-1 xl:col-span-1">
              <Select
                key={role || 'all'} // Force re-render when role changes
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                }}
                className={`border h-12 text-sm focus:outline-none block w-full bg-gray-100 dark:bg-white border-transparent focus:bg-white transition-all duration-200 ${
                  role ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <option value="">All Roles</option>
                <option value="vendor">Vendor</option>
                <option value="customer">Customer</option>
              </Select>
            </div>

            {/* Clear Filters Button */}
            <div className="flex justify-center sm:justify-start">
            <div
              onClick={handleClearFilters}
                className={`cursor-pointer flex items-center justify-center p-3 rounded-full h-12 w-12 text-center transition-all duration-200 ${
                  (searchUser || role) 
                    ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40' 
                    : 'text-blue-600 dark:text-blue-100 bg-blue-100 dark:bg-blue-500'
                }`}
                title="Clear all filters"
            >
              <FaFilterCircleXmark />
              </div>
            </div>

            {/* Add User Button */}
            <div className="sm:col-span-2 lg:col-span-1 xl:col-span-1">
              <Button
                type="button"
                onClick={handleAddUser}
                className="w-full rounded-md h-12"
              >
                <span className="mr-3">
                  <FiPlus />
                </span>
                Add User
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Filter Summary */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex flex-wrap items-center gap-2">
            {(searchUser || role) && (
              <>
                <span className="font-medium text-blue-700 dark:text-blue-300">Active Filters:</span>
                {searchUser && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                    Search: "{searchUser}"
                    <button
                      onClick={() => setSearchUser("")}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-700"
                    >
                      ×
                    </button>
                  </span>
                )}
                {role && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
                    Role: {role === 'vendor' ? 'Vendor' : 'Customer'}
                    <button
                      onClick={() => setRole("")}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-700"
                    >
                      ×
                    </button>
                  </span>
                )}
              </>
            )}
            {!searchUser && !role && (
              <span className="text-gray-600 dark:text-gray-400">No filters applied</span>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              {dataTable.length} of {totalResults} users
            </span>
            {totalResults > 0 && (
              <span className="text-xs text-gray-500">
                Page {currentPage} of {Math.ceil(totalResults / resultsPerPage)}
              </span>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <Loading loading={loading} />
      ) : totalResults !== 0 ? (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>ID</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Opening Balance</TableCell>
                <TableCell>NTN</TableCell>
                <TableCell>STRN</TableCell>
                <TableCell>Address</TableCell>
                <TableCell className="text-center">Actions</TableCell>
              </tr>
            </TableHeader>
            <UserTable customers={dataTable} onEditUser={handleEditUser} />
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
        <NotFound title="User" />
      )}
    </>
  );
};

export default Users;
