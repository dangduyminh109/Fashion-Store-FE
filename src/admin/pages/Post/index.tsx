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
import type PostResponse from "~/admin/types/post";
import type post from "~/admin/types/post";
import { fetchPost, deleteOrRestore, updateStatus } from "~/admin/features/post/postApi";

const listBreadcrumb = [
  {
    title: "Bài Viết",
    url: "/admin/posts",
  },
  {
    title: "Danh Sách Bài Viết",
    url: "/admin/posts",
  },
];

const headCells: HeadCell<PostResponse>[] = [
  {
    id: "image",
    label: "Hình ảnh",
    hasSort: false,
  },
  {
    id: "title",
    label: "Tên bài viết",
    hasSort: true,
  },
  {
    id: "topicName",
    label: "Chủ đề",
    hasSort: true,
  },
  {
    id: "status",
    label: "Trạng thái",
    hasSort: false,
  },
];
function Post() {
  const dispatch = useDispatch<AppDispatch>();
  const [trash, setTrash] = useState(false);
  const { status, data, message, code } = useSelector((state: RootState) => state.post);
  let tableData: post[] = [];
  if (data) {
    tableData = data;
  }

  useEffect(() => {
    dispatch(
      fetchPost({
        url: "/post",
        method: "get",
      })
    );
  }, []);

  function handleTrash() {
    dispatch(fetchPost({ url: "/post", method: "get", deleted: !trash }));
    setTrash(!trash);
  }

  return (
    <Fragment>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Danh sách bài viết" />
      <Toolbar
        addNewLabel="bài viết "
        hasTrash={true}
        handleTrash={handleTrash}
        trash={trash}
        createPath="/admin/post/create"
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
        <EnhancedTable<PostResponse>
          headCells={headCells}
          tableData={tableData || []}
          path="/post"
          trash={trash}
          editAction={true}
          restoreAction={true}
          deleteAction={true}
          entity="bài viết"
          deleteOrRestore={deleteOrRestore}
          updateStatus={updateStatus}
        />
      )}
    </Fragment>
  );
}

export default Post;
