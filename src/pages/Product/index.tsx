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
    title: "Danh Sách Sản Phẩm",
    url: "/products",
  },
];

function Product() {
  return (
    <>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Danh sách sản phẩm" />
      <Toolbar>
        <Box>
          <Button variant="contained" startIcon={<AddIcon />}>
            thêm mới sản phẩm
          </Button>
        </Box>
      </Toolbar>
      <Divider sx={{ m: "20px 0" }} />
      <EnhancedTable />
    </>
  );
}

export default Product;
