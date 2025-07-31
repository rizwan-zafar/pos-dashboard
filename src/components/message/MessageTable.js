import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import * as dayjs from "dayjs";
import { TableCell, TableBody, TableRow } from "@windmill/react-ui";
import { FiZoomIn, FiTrash2 } from "react-icons/fi";

import Tooltip from "../tooltip/Tooltip";
import MainModal from "../modal/MainModal";
import { SidebarContext } from "../../context/SidebarContext";
import Status from "../table/Status";
import SelectStatus from "../form/SelectStatus";
import EditDeleteButton from "../table/EditDeleteButton";
import useToggleDrawer from "../../hooks/useToggleDrawer";

const MessageTable = ({ messages }) => {
  const [customerId, setCustomerId] = useState("");
  const { title, handleModalOpen, handleUpdate } = useToggleDrawer();

  return (
    <>
      <MainModal id={customerId} title={title} />
      <TableBody>
        {messages?.map((message) => (
          <TableRow key={message?.id}>
            <TableCell>
              <span className="font-semibold uppercase text-xs">
                {message?.id}
              </span>
            </TableCell>
            <TableCell >
              <span title={message.message} className="text-sm">{`${ message.message.length > 40 ?message.message.substring(0, 40)+"..." : message.message}`}</span>{" "}
            </TableCell>

            <TableCell>
              <span className="text-sm">{message.fullName}</span>{" "}
            </TableCell>

             <TableCell>
              <span className="text-sm">{message.phone || "-"}</span>{" "}
            </TableCell>

            <TableCell>
              <span className="text-sm">{message.email}</span>{" "}
            </TableCell>

             <TableCell>
              <span className="text-sm">
                {dayjs(message.createdAt).format("MMM D, YYYY")}
              </span>
            </TableCell>

            <TableCell>
              <Status status={message.status || "pending"} />
            </TableCell>

            <TableCell>
              <SelectStatus
                id={message.id}
                order={message}
                component="message"
              />
            </TableCell>

            <TableCell>
              <EditDeleteButton
                id={message.id}
                title={message.id}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                // action="subscriptionAction"
                action={false}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default MessageTable;
