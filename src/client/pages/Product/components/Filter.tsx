import { Fragment } from "react/jsx-runtime";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useDispatch, useSelector } from "react-redux";

import { useFetch } from "~/client/hooks/useFetch";
import type { AppDispatch, RootState } from "~/client/store";
import { toggleFilter } from "~/client/features/product/productSlice";
import { fetchProduct } from "~/client/features/product/productApi";
import type Brand from "~/client/types/brand";
import type Attribute from "~/client/types/attribute";
import type CategoryTree from "~/client/types/categoryTree";
import { useEffect, useState } from "react";
import type AttributeValue from "~/client/types/attributeValue";

export const priceDataFilter = [
  {
    minValue: 0,
    maxValue: 100000,
    label: "Giá dưới 100,000đ",
  },
  {
    minValue: 100000,
    maxValue: 200000,
    label: "100,000đ - 200,000đ",
  },
  {
    minValue: 200000,
    maxValue: 500000,
    label: "200,000đ - 500,000đ",
  },
  {
    minValue: 500000,
    maxValue: 1000000,
    label: "500,000đ - 1,000,000đ",
  },
  {
    minValue: 1000000,
    maxValue: null,
    label: "Giá trên 1,000,000đ",
  },
];

export const Filter = () => {
  const {
    data: brandData,
    loading: brandLoading,
    error: brandError,
  } = useFetch<Brand[]>({
    endpoint: "/brand",
    method: "get",
  });

  const {
    data: attributeData,
    loading: attributeLoading,
    error: attributeError,
  } = useFetch<Attribute[]>({
    endpoint: "/attribute",
    method: "get",
  });

  const { categoryData } = useSelector((state: RootState) => state.navbar);
  const { filters, size } = useSelector((state: RootState) => state.product);
  const dispatch = useDispatch<AppDispatch>();
  const [listCategory, setListCategory] = useState<CategoryTree[]>([]);

  useEffect(() => {
    if (categoryData) {
      const temp: CategoryTree[] = [];

      function dfsCategory(data: CategoryTree[]) {
        data.forEach((c) => {
          temp.push(c);
          if (c.children && c.children.length > 0) {
            dfsCategory(c.children);
          }
        });
      }

      dfsCategory(categoryData);
      setListCategory(temp);
    }
  }, [categoryData]);

  function handleChangeCategory(id: number) {
    dispatch(toggleFilter({ group: "categorys", key: String(id) }));

    const newFilters = {
      ...filters,
      categorys: { ...(filters.categorys || {}) },
    };

    newFilters.categorys[String(id)] = !newFilters.categorys[String(id)];

    const categoryId = Object.entries(newFilters.categorys).reduce((result, [key, value]) => {
      if (value) {
        return result ? result + "," + key : key;
      }
      return result;
    }, "");

    let url = `/product?page=${0}&size=${size}`;
    if (categoryId) {
      url = url + `&categoryIds=` + categoryId;
    }
    dispatch(
      fetchProduct({
        url,
        method: "get",
      })
    );
  }

  function RenderAttributeValue({ atrV }: { atrV: AttributeValue }) {
    let isActive = !!filters.attributes?.[String(atrV.attributeName)]?.[String(atrV.id)];
    switch (atrV.displayType) {
      case "COLOR":
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              mt: "10px",
            }}
          >
            <Button
              key={atrV.id}
              variant="contained"
              onClick={() => {
                dispatch(
                  toggleFilter({
                    group: "attributes",
                    key: String(atrV.id),
                    attributeGroup: atrV.attributeName,
                  })
                );
              }}
              sx={{
                aspectRatio: "1/1",
                p: 0,
                minWidth: "28px",
                fontSize: "1.4rem",
                borderRadius: "50%",
                bgcolor: atrV.color || "primary.main",
                cursor: "pointer",
                position: "relative",
                m: "2px",
                "&::before": {
                  content: "''",
                  position: "absolute",
                  height: "100%",
                  width: "100%",
                  borderRadius: "50%",
                  transform: "scale(1.2)",
                  top: 0,
                  left: 0,
                  border: "2px solid",
                  borderColor: isActive ? "secondary.main" : "none",
                },
              }}
            ></Button>
            <Typography>{atrV.color ? atrV.value : ""}</Typography>
          </Box>
        );
      case "IMAGE":
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "10px",
              mt: "10px",
            }}
          >
            <Button
              key={atrV.id}
              variant={"outlined"}
              onClick={() => {
                dispatch(
                  toggleFilter({
                    group: "attributes",
                    key: String(atrV.id),
                    attributeGroup: atrV.attributeName,
                  })
                );
              }}
              sx={{
                height: "35px",
                width: "35px",
                fontSize: "1.4rem",
                cursor: "pointer",
                p: 0.2,
                minWidth: "20px",
                "& img": {
                  height: "100%",
                  borderRadius: "3px",
                  objectFit: "cover",
                },
                border: isActive ? "2px solid" : "1px solid",
                borderColor: isActive ? "secondary.main" : "#fff",
              }}
            >
              {atrV.image ? <img src={atrV.image} alt="biến thể" /> : atrV.value}
            </Button>
            <Typography>{atrV.value}</Typography>
          </Box>
        );
      default:
        return (
          <Fragment>
            <Checkbox
              size="large"
              sx={{
                "& svg": {
                  color: "secondary.main",
                },
                "&.Mui-checked svg": {
                  color: "secondary.main",
                },
              }}
              checked={isActive}
              onChange={() => {
                dispatch(
                  toggleFilter({
                    group: "attributes",
                    key: String(atrV.id),
                    attributeGroup: atrV.attributeName,
                  })
                );
              }}
            />
            <Typography>{atrV.value}</Typography>
          </Fragment>
        );
    }
  }

  return (
    <Box sx={{ px: 2 }}>
      <Box sx={{ p: 1 }}>
        <Typography
          sx={{
            fontSize: "1.6rem",
            fontWeight: 600,
            textTransform: "uppercase",
            mb: 1,
          }}
        >
          Danh mục
        </Typography>
        <Box>
          {listCategory &&
            listCategory.length > 0 &&
            listCategory.map((item) => {
              return (
                <FormGroup sx={{ mt: 1, gap: 1.5 }} key={item.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="large"
                        sx={{
                          "& svg": {
                            color: "secondary.main",
                          },
                          "&.Mui-checked svg": {
                            color: "secondary.main",
                          },
                        }}
                        checked={filters.categorys[item.slug]}
                        onChange={() => {
                          handleChangeCategory(item.id);
                        }}
                      />
                    }
                    label={item.name}
                  />
                </FormGroup>
              );
            })}
        </Box>
      </Box>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ p: 1 }}>
        <Typography
          sx={{
            fontSize: "1.6rem",
            fontWeight: 600,
            textTransform: "uppercase",
            mb: 1,
          }}
        >
          Thương Hiệu
        </Typography>
        <Box>
          {brandData &&
            !brandLoading &&
            !brandError &&
            brandData.length > 0 &&
            brandData.map((item) => {
              return (
                <FormGroup sx={{ mt: 1, gap: 1.5 }} key={item.id}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="large"
                        sx={{
                          "& svg": {
                            color: "secondary.main",
                          },
                          "&.Mui-checked svg": {
                            color: "secondary.main",
                          },
                        }}
                        checked={filters.brands[item.slug]}
                        onChange={() => dispatch(toggleFilter({ group: "brands", key: item.slug }))}
                      />
                    }
                    label={item.name}
                  />
                </FormGroup>
              );
            })}
        </Box>
      </Box>
      <Divider sx={{ my: 1 }} />

      <Box sx={{ p: 1 }}>
        <Typography
          sx={{
            fontSize: "1.6rem",
            fontWeight: 600,
            textTransform: "uppercase",
            mb: 1,
          }}
        >
          Mức giá
        </Typography>
        <Box>
          {priceDataFilter &&
            priceDataFilter.length > 0 &&
            priceDataFilter.map((item, idx) => {
              return (
                <FormGroup sx={{ mt: 1, gap: 1.5 }} key={idx}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="large"
                        sx={{
                          "& svg": {
                            color: "secondary.main",
                          },
                          "&.Mui-checked svg": {
                            color: "secondary.main",
                          },
                        }}
                        checked={filters.prices[idx]}
                        onChange={() =>
                          dispatch(toggleFilter({ group: "prices", key: String(idx) }))
                        }
                      />
                    }
                    label={item.label}
                  />
                </FormGroup>
              );
            })}
        </Box>
      </Box>

      {attributeData &&
        !attributeLoading &&
        !attributeError &&
        attributeData.length > 0 &&
        attributeData.map((item: Attribute) => {
          return (
            <Fragment key={item.id}>
              <Divider sx={{ my: 1 }} />
              <Box>
                <Typography
                  sx={{
                    fontSize: "1.6rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    mb: 1,
                  }}
                >
                  {item.name}
                </Typography>
                {item.listAttributeValue &&
                  item.listAttributeValue.length > 0 &&
                  item.listAttributeValue.map((atrv) => {
                    return (
                      <Stack spacing={1.5} key={atrv.id}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <RenderAttributeValue atrV={atrv} />
                        </Box>
                      </Stack>
                    );
                  })}
              </Box>
            </Fragment>
          );
        })}
    </Box>
  );
};
