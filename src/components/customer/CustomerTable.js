import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import * as dayjs from "dayjs";
import { TableCell, TableBody, TableRow } from "@windmill/react-ui";
import { FiZoomIn, FiTrash2 } from "react-icons/fi";

import Tooltip from "../tooltip/Tooltip";
import MainModal from "../modal/MainModal";
import { SidebarContext } from "../../context/SidebarContext";
import SelectStatus from "../form/SelectStatus";
import Status from "../table/Status";

const CustomerTable = ({ customers }) => {
  const [customerId, setCustomerId] = useState("");
  const { toggleModal } = useContext(SidebarContext);
  const [title, setTitle] = useState("");

  const handleModalOpen = (id, title) => {
    setCustomerId(id);
    toggleModal();
    setTitle(title);
  };

  return (
    <>
      <MainModal id={customerId} title={title} />
      <TableBody>
        {" "}
        {customers?.map((user) => (
          <TableRow key={user?.id}>
            <TableCell>
              <span className="font-semibold uppercase text-xs">
                {/* {' '}
                {console.log('------' ,user)}
                {user?._id?.substring(20, 24)} */}
                {user?.id}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm">
                {dayjs(user.createdAt).format("MMM D, YYYY")}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm">{user.name}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm">{user.email}</span>{" "}
            </TableCell>
            <TableCell>
              <span className="text-sm font-medium">{user.phone}</span>
            </TableCell>

            {/* <TableCell className="text-center">
              <SelectStatus id={user.id} order={user} component="customer" role={true} />
            </TableCell> */}

 
            <TableCell className="text-center text-xs">
              <Status status={user.status} />
            </TableCell>
              <TableCell className="text-center">
              <SelectStatus id={user.id} order={user} component="customer" />
            </TableCell>

            {/* <TableCell className="text-center text-xs">
              <Status status={user.isVerified ? "verified":"non-verified"} />
            </TableCell> */}
              <TableCell className="text-center">
              <SelectStatus id={user.id} order={user} component="customer-verification" />
            </TableCell>
          
            <TableCell>
              <div className="flex justify-end text-right">
                <div className="p-2 cursor-pointer text-gray-400 hover:text-green-600">
                  {" "}
                  <Link to={`/customer-order/${user.id}`}>
                    <Tooltip
                      id="view"
                      Icon={FiZoomIn}
                      title="View Order"
                      bgColor="#34D399"
                    />
                  </Link>
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
    </>
  );
};

export default CustomerTable;
