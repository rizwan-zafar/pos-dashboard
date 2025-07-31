import React from "react";
import { TableCell, TableBody, TableRow } from "@windmill/react-ui";
import useToggleDrawer from "../../hooks/useToggleDrawer";
import Status from "../table/Status";
import SelectStatus from "../form/SelectStatus";
import EditDeleteButton from "../table/EditDeleteButton";
import MainModal from "../modal/MainModal";
import { Link } from "react-router-dom";
import Tooltip from "../tooltip/Tooltip";
import { FiZoomIn } from "react-icons/fi";
import { RxCaretDown } from "react-icons/rx";

const OrderTable = ({ orders }) => {
  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
  // console.log(">>>>> ", orders);
  return (
    <>
      <MainModal id={serviceId} title={title} />
      <TableBody>
        {orders?.map((order, i) => (
          <TableRow key={order.id}>
            <TableCell>
              <span className="font-semibold uppercase text-xs">
                #on{order.id}
              </span>
            </TableCell>
          
          

            <TableCell>
              {order?.items?.length > 0 ? (
                <div className="relative">
                  <select className="block w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring focus:ring-blue-500 appearance-none">
                    {order.items.map((item, i) => (
                      <option key={i}>
                        {item?.productDetails?.title || "Unnamed Product"}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                    <RxCaretDown className="text-gray-400 text-xl" />
                  </div>
                </div>
              ) : (
                <p className="text-sm text-center">-</p>
              )}
            </TableCell>

          

            <TableCell>
              <span className="text-sm"> $ {Math.round(order.totalPrice)}</span>
            </TableCell>

            <TableCell>
              <span className="text-sm"> {order.user.phone}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm"> {order.user.email}</span>
            </TableCell>

            <TableCell className="text-center text-xs">
              <Status status={order.status} />
            </TableCell>

            <TableCell className="text-center">
              <SelectStatus id={order.id} order={order} />
            </TableCell>

            <TableCell className="text-right flex justify-end">
              <div className="p-2 cursor-pointer text-gray-400 hover:text-green-600">
                {" "}
                <Link to={`/order/${order.id}`}>
                  <Tooltip
                    id="view"
                    Icon={FiZoomIn}
                    title="View Invoice"
                    bgColor="#34D399"
                  />
                </Link>
              </div>
            </TableCell>
            <TableCell>
              <EditDeleteButton
                id={order.id}
                title={order.id}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                // action="orderAction"
                action={false}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default OrderTable;
