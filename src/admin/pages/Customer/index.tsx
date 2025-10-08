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
import type CustomerResponse from "~/admin/types/customer";
import type customer from "~/admin/types/customer";
import {
  fetchCustomer,
  deleteOrRestore,
  updateStatus,
} from "~/admin/features/customer/customerApi";

const listBreadcrumb = [
  {
    title: "Khách Hàng",
    url: "/admin/customers",
  },
  {
    title: "Danh Sách Khách Hàng",
    url: "/admin/customers",
  },
];

const headCells: HeadCell<CustomerResponse>[] = [
  {
    id: "avatar",
    label: "Ảnh đại diện",
    hasSort: false,
  },
  {
    id: "fullName",
    label: "Tên khách hàng",
    hasSort: true,
  },
  {
    id: "email",
    label: "Email",
    hasSort: true,
  },
  {
    id: "phone",
    label: "Điện thoại",
    hasSort: false,
  },
  {
    id: "authProvider",
    label: "Phương thức ĐK",
    hasSort: true,
  },
  {
    id: "status",
    label: "Trạng thái",
    hasSort: false,
  },
];

const Customer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [trash, setTrash] = useState(false);
  const { status, data, message, code } = useSelector((state: RootState) => state.customer);
  let tableData: customer[] = [];
  if (data) {
    tableData = data;
  }

  useEffect(() => {
    dispatch(
      fetchCustomer({
        url: "/customer",
        method: "get",
      })
    );
  }, []);

  function handleTrash() {
    dispatch(fetchCustomer({ url: "/customer", method: "get", deleted: !trash }));
    setTrash(!trash);
  }

  return (
    <Fragment>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Danh sách khách hàng" />
      <Toolbar
        addNewLabel="khách hàng"
        hasTrash={true}
        handleTrash={handleTrash}
        trash={trash}
        createPath="/admin/customer/create"
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
        <EnhancedTable<CustomerResponse>
          headCells={headCells}
          tableData={tableData || []}
          path="/customer"
          trash={trash}
          editAction={true}
          restoreAction={true}
          deleteAction={true}
          entity="khách hàng"
          deleteOrRestore={deleteOrRestore}
          updateStatus={updateStatus}
        />
      )}
    </Fragment>
  );
};

export default Customer;
