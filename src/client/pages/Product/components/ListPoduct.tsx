import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useSearchParams } from "react-router-dom";

import { CartItem } from "~/client/components/CartItem";
import { fetchProduct, refillProduct } from "~/client/features/product/productApi";
import type { AppDispatch, RootState } from "~/client/store";
import { setPage, setTitle } from "~/client/features/product/productSlice";
import type ProductFeatured from "~/client/types/productFeatured";
import { priceDataFilter } from "./Filter";
import handlePrice from "~/utils/handlePrice";
export const ListProduct = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { listProduct, page, size, totalPage, filters, sort, loading } = useSelector(
    (state: RootState) => state.product
  );
  const [productData, setProductData] = useState<ProductFeatured[]>([]);
  const [searchParams] = useSearchParams();
  const promotion = searchParams.get("promotion");
  const search = searchParams.get("search");
  useEffect(() => {
    const categoryId = Object.entries(filters.categorys).reduce((result, [key, value]) => {
      if (value) {
        return result ? result + "," + key : key;
      }
      return result;
    }, "");

    let url = `/product?page=${0}&size=${size}`;
    if (categoryId) {
      url = url + `&categoryIds=` + categoryId;
    }
    if (search) {
      url = url + "&search=" + search;
    }
    if (promotion) {
      url = url + "&promotion=true";
      dispatch(setTitle("Sản Phẩm Khuyến Mãi"));
    }
    dispatch(
      fetchProduct({
        url,
        method: "get",
      })
    );
  }, [filters.categorys, promotion]);

  useEffect(() => {
    let data = [];
    for (let index = page * size; index < listProduct.length && data.length < size; index++) {
      data.push(listProduct[index]);
    }
    let filterData = data;
    filterData = data.filter((item) => {
      let brandValid = false;
      let priceValid = false;
      let attributeValid = false;
      let listAttributeId: string[] = [];
      item.variants.forEach((v) => {
        v.attributeValues.forEach((atrV) => {
          listAttributeId.push(String(atrV.id));
        });
      });

      for (const [groupKey, GroupValue] of Object.entries(filters)) {
        if (groupKey === "brands") {
          if (Object.keys(filters.brands).length === 0) {
            brandValid = true;
          }
          let isAllFalse = true;
          for (const [key, value] of Object.entries(GroupValue)) {
            if (filters.brands[key]) {
              isAllFalse = false;
            }
            if (item.brandName?.toUpperCase() === key?.toUpperCase() && value) {
              brandValid = true;
              break;
            }
          }
          if (!brandValid && isAllFalse) {
            brandValid = true;
          }
        } else if (groupKey === "attributes") {
          if (Object.keys(filters.attributes).length === 0) {
            attributeValid = true;
          }
          let isAllFalse = true;
          for (const [key, value] of Object.entries(GroupValue)) {
            for (const [childKey, childValue] of Object.entries(value)) {
              if (filters.attributes[key][childKey] && isAllFalse) {
                isAllFalse = false;
              }
              if (childValue && listAttributeId.includes(childKey)) {
                attributeValid = true;
                break;
              }
            }
          }
          if (!attributeValid && isAllFalse) {
            attributeValid = true;
          }
        } else if (groupKey === "prices") {
          if (Object.keys(filters.prices).length === 0) {
            priceValid = true;
          }
          let isAllFalse = true;
          for (const [key, value] of Object.entries(GroupValue)) {
            if (filters.prices[key]) {
              isAllFalse = false;
            }
            if (value) {
              const { minValue, maxValue } = priceDataFilter[Number(key)];
              const { minPromotionPrice, minSalePrice } = handlePrice(item.variants);
              if (
                minPromotionPrice &&
                minPromotionPrice >= minValue &&
                (!maxValue || minPromotionPrice <= maxValue)
              ) {
                priceValid = true;
              } else if (minSalePrice >= minValue && (!maxValue || minSalePrice <= maxValue)) {
                priceValid = true;
              }
            }
          }
          if (!priceValid && isAllFalse) {
            priceValid = true;
          }
        }
      }

      if (brandValid && priceValid && attributeValid) {
        return item;
      }
    });

    if (sort && sort != "default") {
      if (sort == "a-z") {
        filterData.sort((a, b) => a.name[0].localeCompare(b.name[0]));
      } else if (sort == "z-a") {
        filterData.sort((a, b) => a.name[0].localeCompare(b.name[0])).reverse();
      } else if (sort == "asc") {
        filterData = filterData.sort((item1, item2) => {
          let price = handlePrice(item1.variants);
          let price2 = handlePrice(item2.variants);
          let resultPrice = price.minPromotionPrice ? price.minPromotionPrice : price.minSalePrice;
          let resultPrice2 = price2.minPromotionPrice
            ? price2.minPromotionPrice
            : price2.minSalePrice;
          return resultPrice - resultPrice2;
        });
      } else if (sort == "desc") {
        filterData = filterData.sort((item1, item2) => {
          let price = handlePrice(item1.variants);
          let price2 = handlePrice(item2.variants);
          let resultPrice = price.minPromotionPrice ? price.minPromotionPrice : price.minSalePrice;
          let resultPrice2 = price2.minPromotionPrice
            ? price2.minPromotionPrice
            : price2.minSalePrice;
          return resultPrice2 - resultPrice;
        });
      }
    }

    setProductData(filterData);
  }, [listProduct, page, filters, sort]);

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    const categoryId = Object.entries(filters.categorys).reduce((result, [key, value]) => {
      if (value) {
        return result ? result + "," + key : key;
      }
      return result;
    }, "");
    let url = `/product?page=${value - 1}&size=${size}`;

    if (categoryId) {
      url = url + `&categoryIds=` + categoryId;
    }
    if (value * size >= listProduct.length + size) {
      dispatch(refillProduct({ url, method: "get" }));
    } else {
      dispatch(setPage(value - 1));
    }
  };

  return (
    <Box>
      {productData && productData.length > 0 && (
        <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
          {productData.map((product, index) => (
            <Grid size={{ xs: 6, md: 4, lg: 3 }} key={index} className="card-item-wrapper">
              <CartItem key={product.id} data={product} isNew={false} />
            </Grid>
          ))}
        </Grid>
      )}
      {loading == "pending" && (
        <Box
          sx={{
            with: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress sx={{ color: "secondary.main" }} />
        </Box>
      )}
      {loading == "succeeded" && (!productData || productData.length === 0) && (
        <Typography
          variant="h3"
          sx={{ display: "block", width: "100%", textAlign: "center", my: 2 }}
        >
          Không tìm thấy sản phẩm nào!!!
        </Typography>
      )}
      <Pagination
        onChange={handleChange}
        page={page + 1}
        count={totalPage}
        showFirstButton
        showLastButton
        variant="outlined"
        shape="rounded"
        sx={{
          "& .MuiPagination-ul": {
            justifyContent: "center",
          },
        }}
      />
    </Box>
  );
};
