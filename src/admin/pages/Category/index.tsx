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
import type CategoryResponse from "~/admin/types/category";
import type category from "~/admin/types/category";
import {
  fetchCategory,
  deleteOrRestore,
  updateStatus,
} from "~/admin/features/category/categoryApi";

const listBreadcrumb = [
  {
    title: "Sản Phẩm",
    url: "/admin/products",
  },
  {
    title: "Danh Mục",
    url: "/admin/product/categories",
  },
];

const headCells: HeadCell<CategoryResponse>[] = [
  {
    id: "image",
    label: "Hình ảnh",
    hasSort: false,
  },
  {
    id: "name",
    label: "Tên danh mục",
    hasSort: true,
  },
  {
    id: "parentName",
    label: "Danh mục cha",
    hasSort: true,
  },
  {
    id: "status",
    label: "Trạng thái",
    hasSort: false,
  },
];

function Category() {
  const dispatch = useDispatch<AppDispatch>();
  const [trash, setTrash] = useState(false);
  const { status, data, message, code } = useSelector((state: RootState) => state.category);
  let tableData: category[] = [];
  if (data) {
    tableData = data;
  }

  useEffect(() => {
    dispatch(
      fetchCategory({
        url: "/category",
        method: "get",
      })
    );
  }, []);

  function handleTrash() {
    dispatch(fetchCategory({ url: "/category", method: "get", deleted: !trash }));
    setTrash(!trash);
  }
  return (
    <Fragment>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Danh Mục danh mục" />
      <Toolbar
        addNewLabel="danh mục"
        hasTrash={true}
        handleTrash={handleTrash}
        trash={trash}
        createPath="/admin/category/create"
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
        <EnhancedTable<CategoryResponse>
          headCells={headCells}
          tableData={tableData || []}
          path="/category"
          childPath="variant"
          trash={trash}
          editAction={true}
          restoreAction={true}
          deleteAction={true}
          entity="danh mục"
          deleteOrRestore={deleteOrRestore}
          updateStatus={updateStatus}
        />
      )}
    </Fragment>
  );
}

export default Category;
