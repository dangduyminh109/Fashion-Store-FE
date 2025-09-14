import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PersonIcon from "@mui/icons-material/Person";
import StoreIcon from "@mui/icons-material/Store";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import GroupIcon from "@mui/icons-material/Group";
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
        title: "Thuộc tính",
        to: "/product/attributes",
        id: "attributes",
      },
      {
        title: "Danh mục",
        to: "/product/categories",
        id: "categories",
      },
      {
        title: "Nhập hàng",
        to: "/product/import-receipts",
        id: "import-receipts",
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
        to: "/user/roles",
        id: "roles",
      },
      {
        title: "Phân Quền",
        to: "/user/permissions",
        id: "permissions",
      },
    ],
  },
  {
    title: "Thương Hiệu",
    icon: <StoreIcon fontSize="large" />,
    id: "brands",
    to: "/brands",
  },
  {
    title: "Nhà Cung Cấp",
    icon: <AddBusinessIcon fontSize="large" />,
    id: "suppliers",
    to: "/suppliers",
  },
  {
    title: "Voucher",
    icon: <LocalOfferIcon fontSize="large" />,
    id: "vouchers",
    to: "/vouchers",
  },
  {
    title: "Khách Hàng",
    icon: <GroupIcon fontSize="large" />,
    id: "customers",
    to: "/customers",
  },
];

export default menuItem;
