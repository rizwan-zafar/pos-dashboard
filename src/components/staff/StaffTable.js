import React from "react";
import * as dayjs from "dayjs";
import { TableCell, TableBody, TableRow, Avatar } from "@windmill/react-ui";

import MainModal from "../modal/MainModal";
import MainDrawer from "../drawer/MainDrawer";
import StaffDrawer from "../drawer/StaffDrawer";
import useToggleDrawer from "../../hooks/useToggleDrawer";
import EditDeleteButton from "../table/EditDeleteButton";

const StaffTable = ({ staffs }) => {
    
    const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
  return (
    <> 
      <MainModal id={serviceId} title={title} />
      <MainDrawer>
        <StaffDrawer id={serviceId} />
      </MainDrawer>

      <TableBody>
        {staffs?.map((staff) => (
          <TableRow key={staff.id}>
            <TableCell>
              <span className="font-semibold uppercase text-xs">
                {""}
                {staff.id}
                {/* {staff.id && typeof staff.id === "string"
                  ? staff.id.substring(20, 24)
                  : staff.id} */}
              </span>
            </TableCell>
            <TableCell>
                                <h2 className="text-sm font-medium">{staff.name}</h2>

              {/* <div className="flex items-center">
                
                <Avatar
                  className="hidden mr-3 md:block bg-gray-50"
                  src={
                    staff.image?.startsWith("http")
                      ? staff.image
                      : `http://localhost:4000/upload/${staff.image}`
                  }
                  alt={staff.name[0]}
                />
                <div>
                  <h2 className="text-sm font-medium">{staff.name}</h2>
                </div>
              </div> */}
            </TableCell>

            <TableCell>
              <span className="text-sm">{staff.email}</span>{" "}
            </TableCell>
            <TableCell>
              <span className="text-sm ">{staff.phone}</span>
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {dayjs(staff.joiningData).format("MMM D, YYYY")}
              </span>
            </TableCell>
            {/* <TableCell>
              <span className="text-sm font-semibold">{staff.role}</span>
            </TableCell> */}
            <TableCell>
              <EditDeleteButton
                id={staff.id}
                title={staff.name}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                action={true}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default StaffTable;
