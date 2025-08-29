import Box from "@mui/material/Box";
import Breadcrumb from "~/components/Breadcrumb";
import Toolbar from "~/components/Toolbar";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EnhancedTable from "~/components/Table";
import Divider from "@mui/material/Divider";

const listBreadcrumb = [
  {
    title: "Sản Phẩm",
    url: "/products",
  },
  {
    title: "Danh Mục",
    url: "/product/categories",
  },
];

function Product() {
  return (
    <>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Danh Mục sản phẩm" />
      <Toolbar addNewLabel="danh mục" hasTrash={true} />
      <Divider sx={{ m: "20px 0", bgcolor: "text.primary" }} />
    </>
  );
}

export default Product;
