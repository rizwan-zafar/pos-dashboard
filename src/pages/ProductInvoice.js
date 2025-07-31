import dayjs from "dayjs";
import { useParams } from "react-router";
import React, { useContext, useRef } from "react";
import { IoCloudDownloadOutline } from "react-icons/io5";
import {
  TableCell,
  TableHeader,
  Table,
  TableContainer,
  WindmillContext,
} from "@windmill/react-ui";
import { PDFDownloadLink } from "@react-pdf/renderer";

import useAsync from "../hooks/useAsync";
import Status from "../components/table/Status";
import ProductServices from "../services/ProductServices";
import ProductInvoiceTable from "../components/invoice/ProductInvoiceTable";
import Loading from "../components/preloader/Loading";
import logoDark from "../assets/img/logo/logo-dark.svg";
import logoLight from "../assets/img/logo/logo-light.svg";
import PageTitle from "../components/Typography/PageTitle";
import ProductInvoiceForDownload from "../components/invoice/ProductInvoiceForDownload";

const ProductInvoice = () => {
  const { mode } = useContext(WindmillContext);
  const { id } = useParams();
  const printRef = useRef();

  const { data, loading } = useAsync(() => ProductServices.getProductById(id));
  let product = data;

  return (
    <>
      <PageTitle>Purchase Invoice</PageTitle>

      <div
        ref={printRef}
        className="bg-white dark:bg-gray-800 mb-4 p-6 lg:p-8 rounded-xl shadow-sm overflow-hidden"
      >
        {!loading && (
          <div className="">
            <div className="flex lg:flex-row md:flex-row flex-col lg:items-center justify-between pb-4 border-b border-gray-50 dark:border-gray-700 dark:text-gray-300">
              <h1 className="font-bold font-serif text-xl uppercase">
                Purchase Invoice
                <p className="text-xs mt-1 text-gray-500">
                  Status:{" "}
                  <span className="pl-2 font-medium text-xs capitalize">
                    {" "}
                    <Status status={data.status} />
                  </span>
                </p>
              </h1>
              <div className="lg:text-right text-left">
                <h2 className="lg:flex lg:justify-end text-lg font-serif font-semibold mt-4 lg:mt-0 lg:ml-0 md:mt-0">
                  {mode === "dark" ? (
                    <img src={logoLight} alt="dashtar" width="110" />
                  ) : (
                    <img src={logoDark} alt="dashtar" width="110" />
                  )}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Lahore, Punjab, 54000, <br /> Pakistan. {" "}
                {" "}
                </p>
              </div>
            </div>
            <div className="flex lg:flex-row md:flex-row flex-col justify-between pt-4">
              <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
                <span className="font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                  Date
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 block">
                  {data.createdAt !== undefined && (
                    <span>{dayjs(data?.createdAt).format("MMMM D, YYYY")}</span>
                  )}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 block">
                 Product ID: {data?.id}
                </span>
                <div className="text-sm text-gray-500 dark:text-gray-400 block">
                Category: {data?.category?.name || "N/A"}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 block">
                SKU: {data?.sku || "N/A"}
                </span>
              </div>
              <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
                <span className="font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                  Invoice No
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 block">
                  #PN00{product.id}
                </span>
              </div>
              <div className="flex flex-col lg:text-right text-left">
                <span className="font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                  Product Details
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 block">
                  {data.title}
                  <br />
                  {data.description && data.description.substring(0, 50)}
                  <br />
                  Brand: {data.brand || "N/A"}
                </span>
              </div>
            </div>
          </div>
        )}
        <div>
          {loading ? (
            <Loading loading={loading} />
          ) : (
            <TableContainer className="my-8">
              <Table>
                <TableHeader>
                  <tr>
                    <TableCell> Sr.</TableCell>
                    <TableCell>Product Image</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell className="text-center">Category</TableCell>
                    <TableCell className="text-center">Brand</TableCell>
                    <TableCell className="text-center">Price</TableCell>
                    <TableCell className="text-center">Stock</TableCell>
                    <TableCell className="text-center">Status</TableCell>
                  </tr>
                </TableHeader>

                <ProductInvoiceTable data={data} />
              </Table>
            </TableContainer>
          )}
        </div>

        {!loading && (
          <div className="border rounded-xl border-gray-100 p-8 py-6 bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
            <div className="flex lg:flex-row md:flex-row flex-col justify-start gap-12">
              <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
                <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                  Product Status
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold font-serif block">
                  {data.status}
                </span>
              </div>

              <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
                <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                  Stock Quantity
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold font-serif block">
                  {data.stock || 0} units
                </span>
              </div>

              <div className="flex flex-col sm:flex-wrap">
                <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 dark:text-gray-500 block">
                  Product Price
                </span>
                <span className="text-xl font-serif font-bold text-red-500 dark:text-green-500 block">
                  $ {Math.round(data.price || 0)}.00
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      {!loading && (
        <div className="mb-4 mt-3 flex justify-between">
          <PDFDownloadLink
            document={<ProductInvoiceForDownload data={data} />}
            fileName="ProductInvoice"
          >
            {({ blob, url, loading, error }) =>
              loading ? (
                "Loading..."
              ) : (
                <button className="flex items-center text-sm leading-5 transition-colors duration-150 font-medium focus:outline-none px-5 py-2 rounded-md text-white  border border-transparent active:bg-green-600 base-bg-color focus:ring focus:ring-purple-300 w-auto cursor-pointer">
                  Download Purchase Invoice{" "}
                  <span className="ml-2 text-base">
                    <IoCloudDownloadOutline />
                  </span>
                </button>
              )
            }
          </PDFDownloadLink>
        </div>
      )}
    </>
  );
};

export default ProductInvoice; 