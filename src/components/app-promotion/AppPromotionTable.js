import React from "react";
import { TableCell, TableBody, TableRow, Avatar } from "@windmill/react-ui";

import MainModal from "../modal/MainModal";
import MainDrawer from "../drawer/MainDrawer";
import ShowHideButton from "../table/ShowHideButton";
import EditDeleteButton from "../table/EditDeleteButton";
import useToggleDrawer from "../../hooks/useToggleDrawer";
import dayjs from "dayjs";
import AppPromoDrawer from "../drawer/AppPromotionDrawer";
import Plcaeholder from "../../assets/img/forgot-password-office.jpeg";

const AppPromotionTable = ({ banners }) => {
  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + "....";
    } else {
      return text;
    }
  }
  // console.log("service Id ", serviceId);

  return (
    <>
      <MainModal id={serviceId} title={title} />
      <MainDrawer>
        <AppPromoDrawer id={serviceId} />
      </MainDrawer>
      <TableBody>
        {/* {console.log(products)} */}
        {banners?.map((banner, i) => (
          <TableRow key={i + 1}>
            <TableCell>
              <div className="flex items-center">
                {banner.image && banner.image !== "" ? (
                  <Avatar
                    size="large"
                    className="hidden  mr-2 md:block bg-gray-50 shadow-none"
                    // src={product.image}
                    src={banner.image.replace("5055", "4000")}
                    alt={banner.title}
                  />
                ) : (
                  <Avatar
                    size="large"
                    className="hidden  mr-2 md:block bg-gray-50 shadow-none"
                    src={JSON.parse(banner.gallery)[0].replace("5055", "4000")}
                    //  src={JSON.parse(product.gallery)[0]}
                    alt={banner.title}
                  />
                )}
                {/* <div>
                  <h2 className="text-sm font-medium">{product.title}</h2>
                </div> */}
              </div>
            </TableCell>

            <TableCell>
              <div className="flex items-center">
                {banner.smImage && banner.smImage !== "" ? (
                  <Avatar
                    size="large"
                    className="hidden  mr-2 md:block bg-gray-50 shadow-none"
                    // src={product.image}
                    src={banner.smImage.replace("5055", "4000")}
                    alt={banner.title}
                  />
                ) : (
                  <Avatar
                    size="large"
                    className="hidden  mr-2 md:block bg-gray-50 shadow-none"
                    src={Plcaeholder}
                    //  src={JSON.parse(product.gallery)[0]}
                    alt={banner.title}
                  />
                )}
                {/* <div>
                  <h2 className="text-sm font-medium">{product.title}</h2>
                </div> */}
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

export default React.memo(AppPromotionTable);
