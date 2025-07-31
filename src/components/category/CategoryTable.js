import React, { useEffect, useState } from "react";
import { TableBody, TableRow, TableCell, Avatar } from "@windmill/react-ui";

import MainModal from "../modal/MainModal";
import MainDrawer from "../drawer/MainDrawer";
import ShowHideButton from "../table/ShowHideButton";
import CategoryDrawer from "../drawer/CategoryDrawer";
import useToggleDrawer from "../../hooks/useToggleDrawer";
import EditDeleteButton from "../table/EditDeleteButton";
import ProductServices from "../../services/ProductServices";

const CategoryTable = ({ categories }) => {
  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
  const [productData, setProductData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDataForCategory = async (categoryId) => {
      setLoading(true);
      try {
        const data = await ProductServices.getProductsByCategory(categoryId, "type");
        // console.log(data);
        setProductData((prevData) => ({
          ...prevData,
          [categoryId]: data.length,
        }));
      } catch (error) {
        console.error("Error fetching data for category:", categoryId, error);
      } finally {
        setLoading(false);
      }
    };

    categories.forEach((category) => {
      fetchDataForCategory(category.id);
    });
  }, [categories]);
// console.log('>>>>>>>>>>>>>>>>>>>>>>>>>> ' , categories);
  return (
    <>
      <MainModal id={serviceId} title={title} />
      <MainDrawer>
        <CategoryDrawer id={serviceId} />
      </MainDrawer>

      <TableBody>
        {categories?.map((parent ) => (
          <TableRow key={parent?.id || "fallbackKey"}>
            <TableCell className="font-semibold uppercase text-xs">
              {parent.name}
            </TableCell>
            <TableCell>
              <Avatar
                size="large"
                className="hidden mr-3 md:block bg-gray-50 p-1"
                src={parent.icon.replace("5055", "4000")}
                // src={parent.icon}
                // src='http://localhost:5055/upload/furniture1.webp'
                alt={parent.parent}
              />
            </TableCell>

            <TableCell className="font-medium text-sm">
              <div className="flex flex-row">
              { JSON.parse(parent.children)?.map((e, i)=>
              <span
              key={i}
                 className="bg-gray-200 mr-2 border-0 text-gray-500 rounded-full inline-flex items-center justify-center px-2 py-1 text-xs font-semibold font-serif mt-2 dark:bg-gray-700 dark:text-gray-300"
                  >
               { e}
                </span>
              )

}
                {/* <span
                  className=" mr-2 border-0 text-gray-500 rounded-full inline-flex items-center justify-center px-2 py-1 text-xs font-semibold font-serif mt-2 dark:bg-gray-700 dark:text-gray-300"
                  // className="bg-gray-200 mr-2 border-0 text-gray-500 rounded-full inline-flex items-center justify-center px-2 py-1 text-xs font-semibold font-serif mt-2 dark:bg-gray-700 dark:text-gray-300"
                >
                  { JSON.parse(parent.children)?.map((e)=>' '+ e + ', ') || '-'}
                </span> */}
              </div>
            </TableCell>

            <TableCell className="text-sm ">
              {loading ? "Loading..." : productData[parent.id] || 0}
            </TableCell>

            <TableCell>
              <ShowHideButton id={parent.id} status={parent.status} />
            </TableCell>

            <TableCell>
              <EditDeleteButton
                id={parent.id}
                title={parent.parent}
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

export default CategoryTable;