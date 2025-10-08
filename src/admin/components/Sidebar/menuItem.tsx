import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import PersonIcon from "@mui/icons-material/Person";
import StoreIcon from "@mui/icons-material/Store";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import GroupIcon from "@mui/icons-material/Group";
import ArticleIcon from "@mui/icons-material/Article";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
const menuItem = [
  {
    title: "Tổng quan",
    icon: <DashboardIcon fontSize="large" />,
    to: "/admin/",
    id: "dashboard",
  },
  {
    title: "Sản phẩm",
    icon: <InventoryIcon fontSize="large" />,
    id: "products",
    children: [
      {
        title: "Danh sách sản phẩm",
        to: "/admin/products",
        id: "products",
      },
      {
        title: "Thuộc tính",
        to: "/admin/product/attributes",
        id: "attributes",
      },
      {
        title: "Danh mục",
        to: "/admin/product/categories",
        id: "categories",
      },
      {
        title: "Nhập hàng",
        to: "/admin/product/import-receipts",
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
        to: "/admin/users",
        id: "users",
      },
      {
        title: "Vai Trò",
        to: "/admin/user/roles",
        id: "roles",
      },
      {
        title: "Phân Quền",
        to: "/admin/user/permissions",
        id: "permissions",
      },
    ],
  },
  {
    title: "Bài Viết",
    icon: <ArticleIcon fontSize="large" />,
    id: "post",
    children: [
      {
        title: "Danh Sách Bài Viết",
        to: "/admin/posts",
        id: "posts",
      },
      {
        title: "Chủ Đề",
        to: "/admin/post/topics",
        id: "topics",
      },
    ],
  },
  {
    title: "Thương Hiệu",
    icon: <StoreIcon fontSize="large" />,
    id: "brands",
    to: "/admin/brands",
  },
  {
    title: "Nhà Cung Cấp",
    icon: <LocalShippingIcon fontSize="large" />,
    id: "suppliers",
    to: "/admin/suppliers",
  },
  {
    title: "Voucher",
    icon: <LocalOfferIcon fontSize="large" />,
    id: "vouchers",
    to: "/admin/vouchers",
  },
  {
    title: "Khách Hàng",
    icon: <GroupIcon fontSize="large" />,
    id: "customers",
    to: "/admin/customers",
  },
  {
    title: "Đơn Hàng",
    icon: <ShoppingCartIcon fontSize="large" />,
    id: "orders",
    to: "/admin/orders",
  },
];

export default menuItem;
