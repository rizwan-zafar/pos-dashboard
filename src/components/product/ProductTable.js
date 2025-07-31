import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  TableCell,
  TableBody,
  TableRow,
  // Badge,
  Avatar,
} from "@windmill/react-ui";
import { FiMessageCircle, FiZoomIn } from "react-icons/fi";

import Tooltip from "../tooltip/Tooltip";
import MainModal from "../modal/MainModal";
import MainDrawer from "../drawer/MainDrawer";
import ProductDrawer from "../drawer/ProductDrawer";
import ShowHideButton from "../table/ShowHideButton";
import EditDeleteButton from "../table/EditDeleteButton";
import useToggleDrawer from "../../hooks/useToggleDrawer";
import { RxCaretDown } from "react-icons/rx";
import ReviewDrawer from "../drawer/ReviewDrawer";
import { SidebarContext } from "../../context/SidebarContext";

const ProductTable = ({ products }) => {
  const { toggleDrawer } = useContext(SidebarContext);

  const { title, serviceId, setServiceId, handleModalOpen, handleUpdate } =
    useToggleDrawer();
  const [addReview, setAddReview] = useState(false);
  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength - 3) + "....";
    } else {
      return text;
    }
  }

  const handleAddReview = (id) => {
    setAddReview(true);
    setServiceId(id);
    toggleDrawer();
  };

  return (
    <>
      {addReview ? (
        <MainDrawer setAddReview={setAddReview}>
          <ReviewDrawer id={serviceId} setAddReview={setAddReview} />
        </MainDrawer>
      ) : (
        <MainDrawer>
          <ProductDrawer id={serviceId} />
        </MainDrawer>
      )}
      <MainModal id={serviceId} title={title} />

      <TableBody>
        {products?.map((product, i) => (
          <TableRow key={i + 1}>
            <TableCell>
              <div className="flex items-center">
                {product.image && product.image !== "" ? (
                  <Avatar
                    size="large"
                    className="hidden  mr-2 md:block bg-gray-50 shadow-none"
                    src={product.image}
                    alt={product.title}
                  />
                ) : (
                  <Avatar
                    size="large"
                    className="hidden  mr-2 md:block bg-gray-50 shadow-none"
                    src={JSON.parse(product.gallery)[0]}
                    alt={product.title}
                  />
                )}
              </div>
            </TableCell>
            <TableCell>
              <span className="text-xs capitalize font-semibold">
                {" "}
                {product.productCode}
              </span>
            </TableCell>

            <TableCell>
              <span
                title={product.title}
                className="text-xs capitalize font-semibold"
              >
                {" "}
                {product.title.length > 20
                  ? `${product.title.substring(0, 20)}...`
                  : product.title}
              </span>
            </TableCell>
           
            <TableCell>
              <span className="text-sm font-semibold">
                {product.parent || "-"}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm font-semibold">
                {product.children || "-"}
              </span>
            </TableCell>

 <TableCell>
              {JSON.parse(product.variations) &&
              JSON.parse(product.variations).length > 0 ? (
                <div className="relative  ">
                  <select className="block   rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring focus:ring-blue-500 appearance-none ">
                    {JSON.parse(product.variations)
                      .sort((a, b) => {
                        const priceA = a.promo_price_pkr || a.price;
                        const priceB = b.promo_price_pkr || b.price;
                        return priceA - priceB;
                      })
                      .map((v, i) => (
                        <option key={i} value={v.size}>
                          {v.size} ({v.stock}) - (${" "}
                          {v.promo_price_pkr
                            ? `${v.promo_price_pkr} - $ ${v.price}`
                            : v.price}
                          )
                        </option>
                      ))}
                  </select>
                  <div className="absolute h-full text-2xl inset-y-0 right-0 pr-2 flex items-center justify-center pointer-events-none">
                    <RxCaretDown className="text-gray-400 w-full" />
                  </div>
                  {/* <div className="absolute w-full   text-2xl     bottom-0 pr-2 flex items-center justify-center pointer-events-none">
                    <RxCaretDown className="text-gray-400 w-full" />
                  </div> */}
                </div>
              ) : (
                <p className="w-full text-center">-</p>
              )}
            </TableCell>


            <TableCell>
              <span className="text-sm font-semibold">
                {product.price || "-"}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-sm font-semibold">
                {product.promo_price_pkr || "-"}
              </span>
            </TableCell>
                   
            <TableCell>
              <span className="text-sm font-semibold">
                {product.brand || "No Brand"}
              </span>
            </TableCell>

             <TableCell>
              <span className="text-sm font-semibold">
                {product.delivery ? "$ " + product.delivery : "Free Delivery"}
              </span>
            </TableCell>

                    
          
           
            <TableCell>
              <Link
                to={`/product/${product.id}`}
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
              <ShowHideButton id={product.id} status={product.status} />
            </TableCell>

            <TableCell className="d-flex">
              <EditDeleteButton
                id={product.id}
                title={product.title}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                handleAddReview={handleAddReview}
                action={true}
                review={true}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default React.memo(ProductTable);
