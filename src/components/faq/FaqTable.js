import React from "react";
// import { TableCell, TableBody, TableRow, Avatar } from "@windmill/react-ui";
import { TableCell, TableBody, TableRow } from "@windmill/react-ui";
import { Link } from "react-router-dom";
import { FiZoomIn } from "react-icons/fi";
import Tooltip from "../tooltip/Tooltip";

import MainModal from "../modal/MainModal";
import MainDrawer from "../drawer/MainDrawer";
// import ProductDrawer from "../drawer/ProductDrawer";
// import ShowHideButton from "../table/ShowHideButton";
import EditDeleteButton from "../table/EditDeleteButton";
import useToggleDrawer from "../../hooks/useToggleDrawer";
import FaqDrawer from "../drawer/FaqDrawer";

const FaqTable = ({ faqs }) => {
  // console.log(faqs);

  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + "....";
    } else {
      return text;
    }
  }

  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
  return (
    <>
      <MainModal id={serviceId} title={title} />
      <MainDrawer>
        <FaqDrawer id={serviceId} />
      </MainDrawer>
      <TableBody>
        {faqs?.map((faq, i) => (
          <TableRow key={faq.id}>
            <TableCell>
              <span className="text-xs capitalize font-semibold">
                {" "}
                {truncateText(faq.question, 20)}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-xs capitalize font-semibold">
                {" "}
                {truncateText(faq.answer, 20)}
              </span>
            </TableCell>

            <TableCell className="text-right flex justify-end">
              <div className="p-2 cursor-pointer text-gray-400 hover:text-green-600">
                {" "}
                <Link to={`/settings/faq/${faq.id}`}>
                  <Tooltip
                    id="view"
                    Icon={FiZoomIn}
                    title="View Faq"
                    bgColor="#34D399"
                  />
                </Link>
              </div>
            </TableCell>

            <TableCell>
              <EditDeleteButton
                id={faq.id}
                title={"Faq "+faq.id}
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

export default React.memo(FaqTable);
