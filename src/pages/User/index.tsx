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
import type UserResponse from "~/types/user";
import type user from "~/types/user";
import { fetchUser, deleteOrRestore, updateStatus } from "~/features/user/userApi";

const listBreadcrumb = [
  {
    title: "User",
    url: "/users",
  },
  {
    title: "Danh Sách User",
    url: "/users",
  },
];

const headCells: HeadCell<UserResponse>[] = [
  {
    id: "avatar",
    label: "Ảnh đại diện",
    hasSort: false,
  },
  {
    id: "username",
    label: "Tên đăng nhập",
    hasSort: true,
  },
  {
    id: "firstName",
    label: "Họ",
    hasSort: true,
  },
  {
    id: "lastName",
    label: "Tên",
    hasSort: true,
  },
  {
    id: "roleName",
    label: "Vai trò",
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
    id: "status",
    label: "Trạng thái",
    hasSort: false,
  },
];

const User = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [trash, setTrash] = useState(false);
  const { status, data, message, code } = useSelector((state: RootState) => state.user);
  let tableData: user[] = [];
  if (data) {
    tableData = data;
  }

  useEffect(() => {
    dispatch(
      fetchUser({
        url: "/user",
        method: "get",
      })
    );
  }, []);

  function handleTrash() {
    dispatch(fetchUser({ url: "/user", method: "get", deleted: !trash }));
    setTrash(!trash);
  }

  return (
    <Fragment>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Danh sách user" />
      <Toolbar
        addNewLabel="user"
        hasTrash={true}
        handleTrash={handleTrash}
        trash={trash}
        createPath="/user/create"
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
        <EnhancedTable<UserResponse>
          headCells={headCells}
          tableData={tableData || []}
          path="/user"
          trash={trash}
          editAction={true}
          restoreAction={true}
          deleteAction={true}
          entity="user"
          deleteOrRestore={deleteOrRestore}
          updateStatus={updateStatus}
        />
      )}
    </Fragment>
  );
};

export default User;
