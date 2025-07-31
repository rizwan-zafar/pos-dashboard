import React, { useContext } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  Button,
  Card,
  CardBody,
  Pagination,
} from "@windmill/react-ui";
import { FiPlus } from "react-icons/fi";
import useAsync from "../hooks/useAsync";
import useFilter from "../hooks/useFilter";
import NotFound from "../components/table/NotFound";
import Loading from "../components/preloader/Loading";
import { SidebarContext } from "../context/SidebarContext";
import MainDrawer from "../components/drawer/MainDrawer";
import BannerTable from "../components/banner/BannerTable";
import BannerDrawer from "../components/drawer/BannerDrawer";
import BannerServices from "../services/BannerServices";

const Banner = () => {
  const { toggleDrawer, handleChangePage, handleSubmitForAll } =
    useContext(SidebarContext);

  const { data, loading } = useAsync(() => BannerServices.getAllBanner(), []);

  const { serviceData } = useFilter(data?.banners);

  return (
    <>
      <MainDrawer>
        <BannerDrawer />
      </MainDrawer>

      <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
        <CardBody>
          <form
            onSubmit={handleSubmitForAll}
            className="py-3  justify-between grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
          >
            <h1 className="text-slate-600 text-2xl font-bold">Banner</h1>

            <div className="w-full md:w-56 lg:w-56 xl:w-56">
              <Button onClick={toggleDrawer} className="w-full rounded-md h-12">
                <span className="mr-3">
                  <FiPlus />
                </span>
                Add Banner
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {loading ? (
        <Loading loading={loading} />
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8 rounded-b-lg">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>IMAGES</TableCell>
                <TableCell>SM-IMAGES</TableCell>
                <TableCell>ALT</TableCell>
                <TableCell>PRODUCT</TableCell>
                <TableCell>TITLE</TableCell>
                <TableCell>START DATET</TableCell>
                <TableCell>END DATET</TableCell>
                <TableCell>ISVISIBLE</TableCell>
                <TableCell className="text-center">VIEW</TableCell>
                <TableCell className="text-center">ENABLES</TableCell>
                <TableCell className="text-right">Actions</TableCell>
              </tr>
            </TableHeader>
            <BannerTable banners={data?.banners} />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={data?.totalDoc}
              resultsPerPage={15}
              onChange={handleChangePage}
              label="Banner Page Navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Banner" />
      )}
    </>
  );
};

export default Banner;
