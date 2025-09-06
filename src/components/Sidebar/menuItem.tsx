import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PersonIcon from "@mui/icons-material/Person";
import StoreIcon from "@mui/icons-material/Store";
const menuItem = [
  {
    title: "Tổng quan",
    icon: <DashboardIcon fontSize="large" />,
    to: "/",
    id: "dashboard",
  },
  {
    title: "Sản phẩm",
    icon: <InventoryIcon fontSize="large" />,
    id: "products",
    children: [
      {
        title: "Danh sách sản phẩm",
        to: "/products",
        id: "products",
      },
      {
        title: "Danh mục",
        to: "/product/categories",
        id: "categories",
      },
    ],
  },
  {
    title: "User",
    icon: <PersonIcon fontSize="large" />,
    id: "user",
    children: [
      {
        title: "Danh Sách User",
        to: "/users",
        id: "users",
      },
      {
        title: "Vai Trò",
        to: "/role",
        id: "role",
      },
      {
        title: "Phân Quền",
        to: "/permission",
        id: "permission",
      },
    ],
  },
  {
    title: "Thương Hiệu",
    icon: <StoreIcon fontSize="large" />,
    id: "brand",
    to: "/brands",
  },
];

export default menuItem;
