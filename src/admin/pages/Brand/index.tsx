import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useEffect, useState } from "react";

import type { HeadCell } from "~/admin/components/Table/interface";
import EnhancedTable from "~/admin/components/Table";
import Breadcrumb from "~/admin/components/Breadcrumb";
import Toolbar from "~/admin/components/Toolbar";
import { type AppDispatch, type RootState } from "~/admin/store";
import type BrandResponse from "~/admin/types/brand";
import type brand from "~/admin/types/brand";
import { fetchBrand, deleteOrRestore, updateStatus } from "~/admin/features/brand/brandApi";

const listBreadcrumb = [
  {
    title: "Thương Hiệu",
    url: "/admin/brands",
  },
  {
    title: "Danh Sách Thương Hiệu",
    url: "/admin/brands",
  },
];

const headCells: HeadCell<BrandResponse>[] = [
  {
    id: "image",
    label: "Hình ảnh",
    hasSort: false,
  },
  {
    id: "name",
    label: "Tên thương hiệu",
    hasSort: true,
  },
  {
    id: "status",
    label: "Trạng thái",
    hasSort: false,
  },
];

function Brand() {
  const dispatch = useDispatch<AppDispatch>();
  const [trash, setTrash] = useState(false);
  const { status, data, message, code } = useSelector((state: RootState) => state.brand);
  let tableData: brand[] = [];
  if (data) {
    tableData = data;
  }

  useEffect(() => {
    dispatch(
      fetchBrand({
        url: "/brand",
        method: "get",
      })
    );
  }, []);

  function handleTrash() {
    dispatch(fetchBrand({ url: "/brand", method: "get", deleted: !trash }));
    setTrash(!trash);
  }

  return (
    <Fragment>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Danh sách thương hiệu" />
      <Toolbar
        addNewLabel="thương hiệu"
        hasTrash={true}
        handleTrash={handleTrash}
        trash={trash}
        createPath="/admin/brand/create"
      />
      <Divider sx={{ m: "20px 0", bgcolor: "text.primary" }} />
      {status === "loading" && (
        <Box
          sx={{
            with: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress sx={{ color: "text.secondary" }} />
        </Box>
      )}
      {status != "loading" && code != 1000 && <Box margin={"0 auto"}>{message}</Box>}
      {status != "loading" && code == 1000 && tableData && (
        <EnhancedTable<BrandResponse>
          headCells={headCells}
          tableData={tableData || []}
          path="/brand"
          trash={trash}
          editAction={true}
          restoreAction={true}
          deleteAction={true}
          entity="thương hiệu"
          deleteOrRestore={deleteOrRestore}
          updateStatus={updateStatus}
        />
      )}
    </Fragment>
  );
}

export default Brand;
