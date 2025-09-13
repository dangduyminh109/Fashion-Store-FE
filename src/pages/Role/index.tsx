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
import type RoleResponse from "~/types/role";
import type role from "~/types/role";
import { fetchRole, deleteOrRestore, updateStatus } from "~/features/role/roleApi";

const listBreadcrumb = [
  {
    title: "Vai Trò",
    url: "/roles",
  },
  {
    title: "Danh Sách Vai Trò",
    url: "/roles",
  },
];

const headCells: HeadCell<RoleResponse>[] = [
  {
    id: "name",
    label: "Tên vai trò",
    hasSort: true,
  },
  {
    id: "status",
    label: "Trạng thái",
    hasSort: false,
  },
  {
    id: "description",
    label: "Mô tả",
    hasSort: false,
  },
];

const Role = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [trash, setTrash] = useState(false);
  const { status, data, message, code } = useSelector((state: RootState) => state.role);
  let tableData: role[] = [];
  if (data) {
    tableData = data;
  }

  useEffect(() => {
    dispatch(
      fetchRole({
        url: "/role",
        method: "get",
      })
    );
  }, []);

  function handleTrash() {
    dispatch(fetchRole({ url: "/role", method: "get", deleted: !trash }));
    setTrash(!trash);
  }

  return (
    <Fragment>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Danh sách vai trò" />
      <Toolbar
        addNewLabel="vai trò"
        hasTrash={true}
        handleTrash={handleTrash}
        trash={trash}
        createPath="/role/create"
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
        <EnhancedTable<RoleResponse>
          headCells={headCells}
          tableData={tableData || []}
          path="/role"
          trash={trash}
          editAction={true}
          restoreAction={true}
          deleteAction={true}
          entity="vai trò"
          deleteOrRestore={deleteOrRestore}
          updateStatus={updateStatus}
        />
      )}
    </Fragment>
  );
};

export default Role;
