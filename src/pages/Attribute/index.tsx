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
import type attribute from "~/types/attribute";
import { fetchAttribute, deleteOrRestore } from "~/features/attribute/attributeApi";

const listBreadcrumb = [
  {
    title: "Thuộc Tính",
    url: "/attributes",
  },
  {
    title: "Danh Sách Thuộc Tính",
    url: "/attributes",
  },
];

const headCells: HeadCell<Attribute>[] = [
  {
    id: "name",
    label: "Tên thuộc tính",
    hasSort: true,
  },
  {
    id: "attributeDisplayType",
    label: "Loại hiển thị",
    hasSort: false,
  },
  {
    id: "listAttributeValue",
    label: "Giá trị thuộc tính",
    hasSort: false,
  },
];

interface Attribute {
  id: number;
  name: string;
  attributeDisplayType: string;
  listAttributeValue: string;
}

function Attribute() {
  const dispatch = useDispatch<AppDispatch>();
  const [trash, setTrash] = useState(false);
  const { status, data, message, code } = useSelector((state: RootState) => state.attribute);
  let tableData: Attribute[] = [];
  if (data) {
    tableData = data.map((item: attribute) => {
      return {
        id: item.id,
        name: item.name,
        attributeDisplayType: item.attributeDisplayType,
        listAttributeValue: item.listAttributeValue
          .map((value) => value.value)
          .filter((item) => item != null)
          .join(","),
      };
    });
  }

  useEffect(() => {
    dispatch(
      fetchAttribute({
        url: "/attribute",
        method: "get",
      })
    );
  }, []);

  function handleTrash() {
    dispatch(fetchAttribute({ url: "/attribute", method: "get", deleted: !trash }));
    setTrash(!trash);
  }

  return (
    <Fragment>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Danh sách thuộc tính" />
      <Toolbar
        addNewLabel="thuộc tính"
        hasTrash={true}
        handleTrash={handleTrash}
        trash={trash}
        createPath="/attribute/create"
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
        <EnhancedTable<Attribute>
          headCells={headCells}
          tableData={tableData || []}
          path="/attribute"
          trash={trash}
          editAction={true}
          restoreAction={true}
          deleteAction={true}
          entity="thuộc tính"
          deleteOrRestore={deleteOrRestore}
        />
      )}
    </Fragment>
  );
}

export default Attribute;
