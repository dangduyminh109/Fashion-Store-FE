import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, createContext } from "react";

import type { HeadCell } from "~/components/Table/interface";
import EnhancedTable from "~/components/Table";
import Breadcrumb from "~/components/Breadcrumb";
import Toolbar from "~/components/Toolbar";
import { type AppDispatch, type RootState } from "~/store";
import type ProductResponse from "~/types/product";
import { fetchProduct } from "~/features/product/productApi";

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

interface Product {
  id: number;
  name: string;
  categoryName: string;
  brandName: string;
  status: boolean;
  isFeatured: boolean | null;
  sku?: string;
  inventory?: number;
  salePrice?: number | string;
  originalPrice?: number | string;
  promotionalPrice?: number | string;
  description?: string;
  children?: Product[];
}

function createData(product: Product): Product {
  return product;
}

const headCells: HeadCell<Product>[] = [
  {
    id: "name",
    label: "Tên sản phẩm",
    hasSort: true,
  },
  {
    id: "sku",
    label: "Mã sản phẩm",
    hasSort: false,
  },
  {
    id: "categoryName",
    label: "Danh mục",
    hasSort: true,
  },
  {
    id: "brandName",
    label: "Thương hiệu",
    hasSort: true,
  },
  {
    id: "inventory",
    label: "Tồn kho",
    hasSort: true,
  },
  {
    id: "salePrice",
    label: "Giá bán",
    hasSort: true,
  },
  {
    id: "originalPrice",
    label: "Giá gốc",
    hasSort: true,
  },
  {
    id: "promotionalPrice",
    label: "Giá ưu đãi",
    hasSort: true,
  },
  {
    id: "status",
    label: "Trạng thái",
    hasSort: false,
  },
  {
    id: "isFeatured",
    label: "Nổi bật",
    hasSort: false,
  },
];

function Mapper(data: ProductResponse[]) {
  return data.flatMap((p: ProductResponse) => {
    if (p.variants.length > 1) {
      return createData({
        id: p.id,
        name: p.name,
        categoryName: p.categoryName,
        brandName: p.brandName,
        status: p.status,
        isFeatured: p.isFeatured,
        sku: p.variants
          .map((v: any) => v.sku)
          .filter((x: any) => x != null)
          .join(", "),
        salePrice: p.variants
          .map((v: any) => v.salePrice)
          .filter((x: any) => x != null)
          .join(", "),
        originalPrice: p.variants
          .map((v: any) => v.originalPrice)
          .filter((x: any) => x != null)
          .join(", "),
        promotionalPrice: p.variants
          .map((v: any) => v.promotionalPrice)
          .filter((x: any) => x != null)
          .join(", "),
        inventory: p.variants.reduce((i: any, v: any) => i + v.inventory, 0),
        description: p.description,
        children: p.variants.map((v: any) => {
          return createData({
            id: v.id,
            name: p.name,
            categoryName: p.categoryName,
            brandName: p.brandName,
            status: v.status,
            isFeatured: null,
            sku: v.sku,
            inventory: v.inventory,
            salePrice: v.salePrice,
            originalPrice: v.originalPrice,
            promotionalPrice: v.promotionalPrice,
          });
        }),
      });
    } else {
      return p.variants.map((v: any) => {
        return createData({
          id: p.id,
          name: p.name,
          categoryName: p.categoryName,
          brandName: p.brandName,
          status: p.status,
          isFeatured: p.isFeatured,
          sku: v.sku,
          inventory: v.inventory,
          salePrice: v.salePrice,
          originalPrice: v.originalPrice,
          promotionalPrice: v.promotionalPrice,
          description: p.description,
        });
      });
    }
  });
}

export const ProductContext = createContext({
  trash: false,
  editAction: true,
  restoreAction: true,
  deleteAction: true,
  entity: "sản phẩm",
});

const Product = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [trash, setTrash] = useState(false);
  const { status, data, message, code } = useSelector((state: RootState) => state.product);
  let tableData: Product[] = [];
  if (data) {
    tableData = Mapper(data);
  }

  useEffect(() => {
    dispatch(fetchProduct());
  }, []);

  function handleTrash() {
    dispatch(fetchProduct({ deleted: !trash }));
    setTrash(!trash);
  }
  return (
    <ProductContext.Provider
      value={{ trash, editAction: true, restoreAction: true, deleteAction: true, entity:"sản phẩm" }}
    >
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Danh sách sản phẩm" />
      <Toolbar addNewLabel="sản phẩm" hasTrash={true} handleTrash={handleTrash} />
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
      {status != "loading" && code != 1000 && <Box>{message}</Box>}
      {status != "loading" && code == 1000 && tableData && (
        <EnhancedTable<Product>
          headCells={headCells}
          tableData={tableData || []}
          path="/product"
          childPath="variant"
        />
      )}
    </ProductContext.Provider>
  );
};

export default Product;
