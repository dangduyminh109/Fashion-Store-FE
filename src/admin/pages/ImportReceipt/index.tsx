import { useDispatch, useSelector } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";

import type { HeadCell } from "~/admin/components/Table/interface";
import EnhancedTable from "~/admin/components/Table";
import Breadcrumb from "~/admin/components/Breadcrumb";
import Toolbar from "~/admin/components/Toolbar";
import { type AppDispatch, type RootState } from "~/admin/store";
import {
  fetchImportReceipt,
  deleteOrRestore,
} from "~/admin/features/importReceipt/importReceiptApi";
import type importReceipt from "~/admin/types/importReceipt";

const listBreadcrumb = [
  {
    title: "Sản Phẩm",
    url: "/admin/products",
  },
  {
    title: "Danh Sách Nhập Hàng",
    url: "/admin/product/import-receipt",
  },
];

const headCells: HeadCell<ImportReceipt>[] = [
  {
    id: "supplierName",
    label: "Nhà cung cấp",
    hasSort: true,
  },
  {
    id: "importDate",
    label: "Ngày nhập hàng",
    hasSort: true,
  },
  {
    id: "numberOfItem",
    label: "Số mặt hàng",
    hasSort: true,
  },
  {
    id: "totalAmount",
    label: "Tổng tiền",
    hasSort: true,
  },
];

interface ImportReceipt {
  id: number;
  importDate: Date;
  supplierName: string;
  numberOfItem: number;
  totalAmount: number;
}

function ImportReceipt() {
  const dispatch = useDispatch<AppDispatch>();
  const [trash, setTrash] = useState(false);
  const { status, data, message, code } = useSelector((state: RootState) => state.importReceipt);
  let tableData: ImportReceipt[] = [];
  if (data) {
    tableData = data.map((item: importReceipt) => {
      const d = new Date(item.importDate);
      const formatted = d.toLocaleDateString("vi-VN");
      return {
        id: item.id,
        importDate: formatted,
        supplierName: item.supplierName,
        numberOfItem: item.importItemList.length,
        totalAmount: item.importItemList.reduce(
          (total, item) => item.importPrice * item.quantity - item.discountAmount + total,
          0
        ),
      };
    });
  }

  useEffect(() => {
    dispatch(
      fetchImportReceipt({
        url: "/import-receipt",
        method: "get",
      })
    );
  }, []);

  function handleTrash() {
    dispatch(fetchImportReceipt({ url: "/import-receipt", method: "get", deleted: !trash }));
    setTrash(!trash);
  }

  return (
    <Fragment>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Danh sách phiếu nhập" />
      <Toolbar
        addNewLabel="phiếu nhập"
        hasTrash={true}
        handleTrash={handleTrash}
        trash={trash}
        createPath="/admin/import-receipt/create"
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
        <EnhancedTable<ImportReceipt>
          headCells={headCells}
          tableData={tableData || []}
          path="/import-receipt"
          trash={trash}
          editAction={true}
          restoreAction={true}
          deleteAction={true}
          entity="phiếp nhập"
          deleteOrRestore={deleteOrRestore}
        />
      )}
    </Fragment>
  );
}

export default ImportReceipt;
