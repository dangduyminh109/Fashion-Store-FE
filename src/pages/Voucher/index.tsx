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
import type VoucherResponse from "~/types/voucher";
import type voucher from "~/types/voucher";
import { fetchVoucher, deleteOrRestore, updateStatus } from "~/features/voucher/voucherApi";

const listBreadcrumb = [
  {
    title: "Voucher",
    url: "/vouchers",
  },
  {
    title: "Danh Sách Voucher",
    url: "/vouchers",
  },
];

const headCells: HeadCell<VoucherResponse>[] = [
  {
    id: "name",
    label: "Tên Voucher",
    hasSort: true,
  },
  {
    id: "code",
    label: "Mã",
    hasSort: true,
  },
  {
    id: "quantity",
    label: "Số Lượng",
    hasSort: true,
  },
  {
    id: "used",
    label: "Đã dùng",
    hasSort: true,
  },
  {
    id: "discountType",
    label: "Đơn vị",
    hasSort: true,
  },
  {
    id: "discountValue",
    label: "Giá trị",
    hasSort: true,
  },
  {
    id: "status",
    label: "Trạng thái",
    hasSort: false,
  },
];

function Voucher() {
  const dispatch = useDispatch<AppDispatch>();
  const [trash, setTrash] = useState(false);
  const { status, data, message, code } = useSelector((state: RootState) => state.voucher);
  let tableData: voucher[] = [];
  if (data) {
    tableData = data.map((item: any) => {
      if (item.discountType === "PERCENT") {
        return {
          ...item,
          discountType: "Phần trăm(%)",
        };
      } else {
        return {
          ...item,
          discountType: "Cố định",
        };
      }
    });
  }

  useEffect(() => {
    dispatch(
      fetchVoucher({
        url: "/voucher",
        method: "get",
      })
    );
  }, []);

  function handleTrash() {
    dispatch(fetchVoucher({ url: "/voucher", method: "get", deleted: !trash }));
    setTrash(!trash);
  }

  return (
    <Fragment>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Danh sách voucher" />
      <Toolbar
        addNewLabel="voucher"
        hasTrash={true}
        handleTrash={handleTrash}
        trash={trash}
        createPath="/voucher/create"
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
        <EnhancedTable<VoucherResponse>
          headCells={headCells}
          tableData={tableData || []}
          path="/voucher"
          trash={trash}
          editAction={true}
          restoreAction={true}
          deleteAction={true}
          entity="voucher"
          deleteOrRestore={deleteOrRestore}
          updateStatus={updateStatus}
        />
      )}
    </Fragment>
  );
}

export default Voucher;
