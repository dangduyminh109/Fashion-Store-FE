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
import type TopicResponse from "~/admin/types/topic";
import type topic from "~/admin/types/topic";
import { fetchTopic, deleteOrRestore, updateStatus } from "~/admin/features/topic/topicApi";

const listBreadcrumb = [
  {
    title: "Chủ Đề",
    url: "/admin/topics",
  },
  {
    title: "Danh Sách Chủ Đề",
    url: "/admin/topics",
  },
];

const headCells: HeadCell<TopicResponse>[] = [
  {
    id: "name",
    label: "Tên chủ đề",
    hasSort: true,
  },
  {
    id: "status",
    label: "Trạng thái",
    hasSort: false,
  },
];

function Topic() {
  const dispatch = useDispatch<AppDispatch>();
  const [trash, setTrash] = useState(false);
  const { status, data, message, code } = useSelector((state: RootState) => state.topic);
  let tableData: topic[] = [];
  if (data) {
    tableData = data;
  }

  useEffect(() => {
    dispatch(
      fetchTopic({
        url: "/topic",
        method: "get",
      })
    );
  }, []);

  function handleTrash() {
    dispatch(fetchTopic({ url: "/topic", method: "get", deleted: !trash }));
    setTrash(!trash);
  }

  return (
    <Fragment>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Danh sách chủ đề" />
      <Toolbar
        addNewLabel="chủ đề "
        hasTrash={true}
        handleTrash={handleTrash}
        trash={trash}
        createPath="/admin/topic/create"
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
        <EnhancedTable<TopicResponse>
          headCells={headCells}
          tableData={tableData || []}
          path="/topic"
          trash={trash}
          editAction={true}
          restoreAction={true}
          deleteAction={true}
          entity="chủ đề"
          deleteOrRestore={deleteOrRestore}
          updateStatus={updateStatus}
        />
      )}
    </Fragment>
  );
}

export default Topic;
