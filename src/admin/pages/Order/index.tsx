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
import { fetchOrder, deleteOrRestore, updateStatus } from "~/admin/features/order/orderApi";
import type order from "~/admin/types/order";

const listBreadcrumb = [
  {
    title: "Khách Hàng",
    url: "/admin/orders",
  },
  {
    title: "Danh Sách Khách Hàng",
    url: "/admin/orders",
  },
];

interface OrderResponse {
  phone: string;
  paymentMethod: string;
  customerName: string;
  orderStatus: string;
  totalDiscount: number;
  finalAmount: number;
  NumOfOrderItem: number;
}

const headCells: HeadCell<OrderResponse>[] = [
  {
    id: "customerName",
    label: "Tên Khách Hàng",
    hasSort: true,
  },
  {
    id: "phone",
    label: "Điện Thoại",
    hasSort: false,
  },
  {
    id: "orderStatus",
    label: "Trạng Thái Đơn",
    hasSort: false,
  },
  {
    id: "paymentMethod",
    label: "Thanh Toán",
    hasSort: false,
  },
  {
    id: "totalDiscount",
    label: "Khuyến mãi",
    hasSort: true,
    isMoney: true,
  },
  {
    id: "finalAmount",
    label: "Tổng Tiền",
    hasSort: true,
    isMoney: true,
  },
  {
    id: "NumOfOrderItem",
    label: "Số mặt hàng",
    hasSort: true,
  },
];

const Order = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [trash, setTrash] = useState(false);
  const { status, data, message, code } = useSelector((state: RootState) => state.order);
  let tableData: OrderResponse[] = [];
  if (data) {
    tableData = data.map((item: order) => ({
      ...item,
      NumOfOrderItem: item.orderItems.length,
    }));
  }

  useEffect(() => {
    dispatch(
      fetchOrder({
        url: "/order",
        method: "get",
      })
    );
  }, []);

  function handleTrash() {
    dispatch(fetchOrder({ url: "/order", method: "get", deleted: !trash }));
    setTrash(!trash);
  }

  return (
    <Fragment>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Danh sách đơn hàng" />
      <Toolbar
        addNewLabel="đơn hàng"
        hasTrash={true}
        handleTrash={handleTrash}
        trash={trash}
        createPath="/admin/order/create"
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
        <EnhancedTable<OrderResponse>
          headCells={headCells}
          tableData={tableData || []}
          path="/order"
          trash={trash}
          editAction={true}
          restoreAction={true}
          deleteAction={true}
          entity="đơn hàng"
          deleteOrRestore={deleteOrRestore}
          updateStatus={updateStatus}
        />
      )}
    </Fragment>
  );
};

export default Order;
