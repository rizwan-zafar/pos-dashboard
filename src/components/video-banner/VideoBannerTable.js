import React from "react";
import { Link } from "react-router-dom";
import {
  TableCell,
  TableBody,
  TableRow,
  // Badge,
  Avatar,
} from "@windmill/react-ui";
import { FiZoomIn } from "react-icons/fi";

import Tooltip from "../tooltip/Tooltip";
import MainModal from "../modal/MainModal";
import MainDrawer from "../drawer/MainDrawer";
import ShowHideButton from "../table/ShowHideButton";
import EditDeleteButton from "../table/EditDeleteButton";
import useToggleDrawer from "../../hooks/useToggleDrawer";
import dayjs from "dayjs";
import BannerDrawer from "../drawer/BannerDrawer";
import Plcaeholder from "../../assets/img/forgot-password-office.jpeg";
import VideoBannerDrawer from "../drawer/VideoBannerDrawer";

const VideoBannerTable = ({ banners }) => {
  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + "....";
    } else {
      return text;
    }
  }
  return (
    <>
      <MainModal id={serviceId} title={title} />
      <MainDrawer>
        <VideoBannerDrawer id={serviceId} />
      </MainDrawer>
      <TableBody>
        {/* {console.log(products)} */}
        {banners?.map((banner, i) => (
          <TableRow key={i + 1}>
            <TableCell>
              <div className="flex items-center">
                {banner.video && (
                  <video
                    className="mr-2 bg-gray-50 shadow-none w-16 h-10   rounded-md"
                    src={banner.video.replace("5055", "4000")}
                    autoPlay
                    loop
                    muted
                  />
                )}
              </div>
            </TableCell>

            <TableCell>
              <span className="text-sm font-semibold">{banner.alt || "-"}</span>
            </TableCell>

            <TableCell>
              <span className="text-sm font-semibold">
                {truncateText(banner.product.title, 30) || ""}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-xs capitalize font-semibold">
                {" "}
                {truncateText(banner.title, 30)}
              </span>
            </TableCell>
            <TableCell>
              {banner.startDate !== undefined && (
                <span className="text-sm font-semibold">
                  {dayjs(banner?.startDate).format("MMMM D, YYYY")}
                </span>
              )}
            </TableCell>

            <TableCell>
              {banner.endingDate !== undefined && (
                <span className="text-sm font-semibold">
                  {dayjs(banner?.endingDate).format("MMMM D, YYYY")}
                </span>
              )}
            </TableCell>

            <TableCell>
              <span className="text-sm font-semibold">
                {banner.isVisible ? "Show" : "Hide"}
              </span>
            </TableCell>

            <TableCell>
              <Link
                to={`/settings/banner/${banner.id}`}
                className="flex justify-center text-center text-gray-400 hover:text-green-600"
              >
                <Tooltip
                  id="details"
                  Icon={FiZoomIn}
                  title="Details"
                  bgColor="#10B981"
                />
              </Link>
            </TableCell>

            <TableCell>
              <ShowHideButton id={banner.id} status={banner.isVisible} />
            </TableCell>

            <TableCell>
              <EditDeleteButton
                id={banner.id}
                title={banner.title}
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

export default React.memo(VideoBannerTable);
