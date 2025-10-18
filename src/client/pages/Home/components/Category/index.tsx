import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CategoryItem } from "./CategoryItem";
import { Fragment } from "react/jsx-runtime";

import type CategoryFeatured from "~/client/types/CategoryFeatured";
import { useFetch } from "~/client/hooks/useFetch";

export function Category() {
  const { data, loading, error } = useFetch<CategoryFeatured[]>({
    endpoint: "/category/featured",
    method: "get",
  });

  return (
    <Fragment>
      {!error && (
        <Box
          component="section"
          id="category"
          className="native-scroll"
          sx={{
            width: "100%",
            py: 5,
            overflow: "hidden",
            bgcolor: "background.default",
          }}
        >
          <Typography variant="h2" sx={{ textAlign: "center" }} mb={3}>
            Danh Mục Sản Phẩm
          </Typography>
          {!loading && data && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                width: "80%",
                margin: "10px auto",
                overflow: "auto",
              }}
            >
              {data &&
                !error &&
                data.map((category, index) => {
                  return <CategoryItem data={category} key={index} />;
                })}
            </Box>
          )}
        </Box>
      )}
    </Fragment>
  );
}
