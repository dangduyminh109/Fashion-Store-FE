import { Fragment } from "react/jsx-runtime";

import Breadcrumb from "~/client/components/Breadcrumb";
import { EmptyCart } from "./components/EmptyCart";
function Cart() {
  const listBreadcrumb = [
    {
      title: "Trang Chủ",
      url: "/",
    },
    {
      title: "Giỏ Hàng",
      url: `/cart`,
    },
  ];

  return (
    <Fragment>
      <Breadcrumb listBreadcrumb={listBreadcrumb} />
      <EmptyCart />
    </Fragment>
  );
}

export default Cart;
