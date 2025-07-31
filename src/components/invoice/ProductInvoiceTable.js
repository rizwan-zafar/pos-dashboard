import React from "react";
import { TableCell, TableBody, TableRow, Avatar } from "@windmill/react-ui";

const ProductInvoiceTable = ({ data }) => {
  if (!data) {
    return (
      <TableBody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 text-serif text-sm ">
        <TableRow className="dark:border-gray-700 dark:text-gray-400">
          <TableCell className="px-6 py-1 whitespace-nowrap font-normal text-gray-500 text-left">
            No data available
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <>
      <TableBody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 text-serif text-sm ">
        <TableRow className="dark:border-gray-700 dark:text-gray-400">
          <TableCell className="px-6 py-1 whitespace-nowrap font-normal text-gray-500 text-left">
            1
          </TableCell>
          <TableCell className="px-6 py-1 whitespace-nowrap font-normal text-gray-500 text-left">
            {data?.image ? (
              <Avatar
                size="large"
                className="hidden mr-2 md:block bg-gray-50 shadow-none"
                src={data.image}
                alt={data?.title || "Product"}
              />
            ) : data?.gallery ? (
              <Avatar
                size="large"
                className="hidden mr-2 md:block bg-gray-50 shadow-none"
                src={JSON.parse(data.gallery)[0] || ""}
                alt={data?.title || "Product"}
              />
            ) : (
              <Avatar
                size="large"
                className="hidden mr-2 md:block bg-gray-50 shadow-none"
                src=""
                alt="No Image"
              />
            )}
          </TableCell>
          <TableCell className="px-6 py-1 whitespace-nowrap font-normal text-gray-500">
            {data.title}
          </TableCell>
          <TableCell className="px-6 py-1 whitespace-nowrap font-normal text-gray-500 capitalize">
            {data?.category?.name || "N/A"}
          </TableCell>
          <TableCell className="px-6 py-1 whitespace-nowrap font-normal text-gray-500 capitalize">
            {data.brand || "N/A"}
          </TableCell>
          <TableCell className="px-6 py-1 whitespace-nowrap font-bold text-center">
            $ {data.price || 0}
          </TableCell>
          <TableCell className="px-6 py-1 whitespace-nowrap font-bold text-center">
            {data.stock || 0}
          </TableCell>
          <TableCell className="px-6 py-1 whitespace-nowrap font-bold text-center">
            <span className={`px-2 py-1 text-xs rounded-full ${
              data.status === 'active' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            }`}>
              {data.status}
            </span>
          </TableCell>
        </TableRow>
      </TableBody>
    </>
  );
};

export default ProductInvoiceTable; 