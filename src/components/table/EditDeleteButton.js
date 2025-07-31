import React from "react";
import { FiEdit, FiMessageSquare, FiTrash2 } from "react-icons/fi";

import Tooltip from "../tooltip/Tooltip";

const EditDeleteButton = ({
  id,
  handleUpdate,
  handleModalOpen,
  handleAddReview,
  title,
  action,
  review
}) => {

  return (
    <>
      <div className="flex justify-end text-right">
        {/* {action !== "orderAction" || action !== "subscriptionAction" && ( */}
          {action  &&  (
          <div
            onClick={() => {
              handleUpdate(id);
            }}
            className="p-2 cursor-pointer text-gray-400 hover:text-green-600"
          >
            <Tooltip id="edit" Icon={FiEdit} title="Edit" bgColor="#68CC58" />
          </div>
        )}
       
        <div
          onClick={() => handleModalOpen(id, title)}
          className="p-2 cursor-pointer text-gray-400 hover:text-red-600"
        >
          <Tooltip
            id="delete"
            Icon={FiTrash2}
            title="Delete"
            bgColor="#EF4444"
          />
        </div>

         {review  &&  id &&(
          <div
            onClick={() => {
              handleAddReview(id);
            }}
            className="p-2 cursor-pointer text-gray-400 hover:text-green-600"
          >
            <Tooltip id="review" Icon={FiMessageSquare} title="Add Review" bgColor="#68CC58" />
          </div>
        )}
      </div>
    </>
  );
};

export default EditDeleteButton;
