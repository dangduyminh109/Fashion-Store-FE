import { Box } from "@mui/material";
import Breadcrumb from "~/components/Breadcrumb";
import Toolbar from "~/components/Toolbar";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EnhancedTable from "~/components/Table";
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
      <Box
        sx={{
          bgcolor: "secondary.light",
          p: "10px",
          flex: 1,
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar>
          <Box>
            <Button variant="contained" startIcon={<AddIcon />}>
              thêm mới sản phẩm
            </Button>
          </Box>
        </Toolbar>
        <Box
          sx={{
            flex: 1,
            mt: "20px",
            borderRadius: "5px",
          }}
        >
          <EnhancedTable />
        </Box>
      </Box>
    </>
  );
}

export default Product;
