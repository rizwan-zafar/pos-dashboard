import React, { useContext, useState } from "react";
import { TableCell, TableBody, TableRow, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "@windmill/react-ui";
import { FiZoomIn, FiTrash2, FiEdit } from "react-icons/fi";

import Tooltip from "../tooltip/Tooltip";
import MainModal from "../modal/MainModal";
import { SidebarContext } from "../../context/SidebarContext";

const UserTable = ({ customers, onEditUser }) => {
  const [userId, setUserId] = useState("");
  const [addressModal, setAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const { toggleModal } = useContext(SidebarContext);
  const [title, setTitle] = useState("");

  const handleModalOpen = (id, title) => {
    setUserId(id);
    toggleModal();
    setTitle(title);
  };

  const handleEdit = (id) => {
    onEditUser(id);
  };

  const handleViewUser = (user) => {
    setSelectedAddress(user.address);
    setSelectedUserName(user.name);
    setAddressModal(true);
  };

  // Get the selected user object for modal display
  const selectedUser = customers?.find(u => u.name === selectedUserName);

  return (
    <>
      <MainModal id={userId} title={title} />
      <TableBody>
        {customers?.map((user) => (
          <TableRow key={user?.id}>
            <TableCell>
              <span className="font-semibold uppercase text-xs">
                {user?.id}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                {user?.image ? ( 
                  <img
                    src={`${process.env.REACT_APP_IMAGE_UPLOAD_URL}${user.image}`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm font-medium">
              {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm">{user.phone}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm">{user.email}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm font-medium">
                Rs {user.opening_balance || 0}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm">{user.ntn || "N/A"}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm">{user.strn || "N/A"}</span>
            </TableCell>
            <TableCell>
              <div className="max-w-xs">
                <span
                  className="text-sm cursor-help"
                  title={user.address || "N/A"}
                >
                  {user.address ? (
                    user.address.length > 20 ?
                      `${user.address.substring(0, 20)}...` :
                      user.address
                  ) : "N/A"}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex justify-center space-x-2">
                <div
                  onClick={() => handleViewUser(user)}
                  className="p-2 cursor-pointer text-gray-400 hover:text-green-600"
                >
                  <Tooltip
                    id="view"
                    Icon={FiZoomIn}
                    title="View Details"
                    bgColor="#34D399"
                  />
                </div>
                <div
                  onClick={() => handleEdit(user.id)}
                  className="p-2 cursor-pointer text-gray-400 hover:text-blue-600"
                >
                  <Tooltip
                    id="edit"
                    Icon={FiEdit}
                    title="Edit"
                    bgColor="#3B82F6"
                  />
                </div>
                <div
                  onClick={() => handleModalOpen(user.id, user.name)}
                  className="p-2 cursor-pointer text-gray-400 hover:text-red-600"
                >
                  <Tooltip
                    id="delete"
                    Icon={FiTrash2}
                    title="Delete"
                    bgColor="#F87171"
                  />
                </div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      {/* User Details Modal */}
      <Modal isOpen={addressModal} onClose={() => setAddressModal(false)}>
        <ModalHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {selectedUser?.role === 'vendor' ? 'Vendor Details' : 'Customer Details'}
          </h3>
        </ModalHeader>
        <ModalBody>
          <div className="p-4 md:p-6">
            {/* Mobile Layout */}
            <div className="md:hidden">
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mb-4">
                  {selectedUser?.image ? (
                    <img
                      src={`${process.env.REACT_APP_IMAGE_UPLOAD_URL || 'http://localhost:5055/upload/'}${selectedUser.image}`}
                      alt={selectedUserName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-xl font-semibold">
                      {selectedUserName?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white text-center">
                  {selectedUserName}
                </h4>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                    <p className="text-gray-900 dark:text-white font-medium capitalize">
                      {selectedUser?.role || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {selectedUser?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {selectedUser?.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Opening Balance</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      Rs {selectedUser?.opening_balance || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">NTN</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {selectedUser?.ntn || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">STRN</p>
                    <p className="text-gray-900 dark:text-white font-medium">
                      {selectedUser?.strn || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {selectedUser?.image ? (
                      <img
                        src={`${process.env.REACT_APP_IMAGE_UPLOAD_URL || 'http://localhost:5055/upload/'}${selectedUser.image}`}
                        alt={selectedUserName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 text-lg font-semibold">
                        {selectedUserName?.charAt(0)?.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {selectedUserName}
                  </h4>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                      <p className="text-gray-900 dark:text-white font-medium capitalize">
                        {selectedUser?.role || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {selectedUser?.email || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {selectedUser?.phone || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Opening Balance</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        Rs {selectedUser?.opening_balance || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">NTN</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {selectedUser?.ntn || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">STRN</p>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {selectedUser?.strn || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Address - Both layouts */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Full Address</p>
              <p className="text-gray-900 dark:text-white leading-relaxed">
                {selectedAddress || "N/A"}
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            className="w-full sm:w-auto"
            onClick={() => setAddressModal(false)}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default UserTable;
