import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useEffect, useState } from "react";

import type { HeadCell } from "~/components/Table/interface";
import EnhancedTable from "~/components/Table";
import Breadcrumb from "~/components/Breadcrumb";
import Toolbar from "~/components/Toolbar";
import { type AppDispatch, type RootState } from "~/store";
import type SupplierResponse from "~/types/supplier";
import type supplier from "~/types/supplier";
import { fetchSupplier, deleteOrRestore, updateStatus } from "~/features/supplier/supplierApi";

const listBreadcrumb = [
  {
    title: "Nhà Cung Cấp",
    url: "/suppliers",
  },
  {
    title: "Danh Sách Nhà Cung Cấp",
    url: "/suppliers",
  },
];

const headCells: HeadCell<SupplierResponse>[] = [
  {
    id: "name",
    label: "Tên nhà cung cấp",
    hasSort: true,
  },
  {
    id: "email",
    label: "Email",
    hasSort: true,
  },
  {
    id: "phone",
    label: "Số điện thoại",
    hasSort: true,
  },
  {
    id: "status",
    label: "Trạng thái",
    hasSort: false,
  },
];

function Supplier() {
  const dispatch = useDispatch<AppDispatch>();
  const [trash, setTrash] = useState(false);
  const { status, data, message, code } = useSelector((state: RootState) => state.supplier);
  let tableData: supplier[] = [];
  if (data) {
    tableData = data;
  }

  useEffect(() => {
    dispatch(
      fetchSupplier({
        url: "/supplier",
        method: "get",
      })
    );
  }, []);

  function handleTrash() {
    dispatch(fetchSupplier({ url: "/supplier", method: "get", deleted: !trash }));
    setTrash(!trash);
  }

  return (
    <Fragment>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Danh sách nhà cung cấp" />
      <Toolbar
        addNewLabel="nhà cung cấp"
        hasTrash={true}
        handleTrash={handleTrash}
        trash={trash}
        createPath="/supplier/create"
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
        <EnhancedTable<SupplierResponse>
          headCells={headCells}
          tableData={tableData || []}
          path="/supplier"
          trash={trash}
          editAction={true}
          restoreAction={true}
          deleteAction={true}
          entity="nhà cung cấp"
          deleteOrRestore={deleteOrRestore}
          updateStatus={updateStatus}
        />
      )}
    </Fragment>
  );
}

export default Supplier;
