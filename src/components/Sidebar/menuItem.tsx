import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PersonIcon from "@mui/icons-material/Person";
const menuItem = [
  {
    title: "Tổng quan",
    icon: <DashboardIcon fontSize="large" />,
    to: "/",
    id: "tong-quan",
  },
  {
    title: "Sản phẩm",
    icon: <InventoryIcon fontSize="large" />,
    id: "san-pham",
    children: [
      {
        title: "Danh sách sản phẩm",
        to: "/detail",
        id: "products",
      },
      {
        title: "Danh mục",
        to: "/",
        id: "category",
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
        to: "/detail",
        id: "users",
      },
      {
        title: "Vai Trò",
        to: "/",
        id: "role",
      },
      {
        title: "Phân Quền",
        to: "/",
        id: "permission",
      },
    ],
  },
];

export default menuItem;
