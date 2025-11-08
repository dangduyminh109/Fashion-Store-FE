import { Fragment } from "react/jsx-runtime";
import { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useSelector } from "react-redux";

import BreadcrumbContext from "~/client/context/BreadcrumbContext";
import type { RootState } from "~/client/store";
import { Filter } from "./components/Filter";
import { MobileDrawer } from "./components/MobileDrawer";
import { Sort } from "./components/Sort";
import { ListProduct } from "./components/ListPoduct";

function Product() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { setBreadcrumb } = useContext(BreadcrumbContext);

  useEffect(() => {
    const listBreadcrumb = [
      {
        title: "Trang Chủ",
        url: "/",
      },
      {
        title: "Danh sách sản phẩm",
        url: `/list-product`,
      },
    ];
    setBreadcrumb(listBreadcrumb);
  }, []);

  const { title } = useSelector((state: RootState) => state.product);

  return (
    <Fragment>
      <Box
        component="section"
        sx={{
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            width: "80%",
            margin: "0 auto",
            overflow: "auto",
            pt: 2,
            pb: 5,
          }}
        >
          <Container maxWidth="lg">
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2.5,
              }}
            >
              <Typography variant="h2" fontSize={"3rem"}>
                {title}
              </Typography>
              <Sort setDrawerOpen={setDrawerOpen} />
            </Box>

            <Grid container spacing={3}>
              <Grid
                size={{ xs: 12, lg: 3 }}
                sx={{ display: { xs: "none", lg: "block" }, height: "120vh", overflow: "auto" }}
              >
                <Filter />
              </Grid>
              <Grid size={{ xs: 12, lg: 9 }}>
                <ListProduct />
              </Grid>
            </Grid>
            <MobileDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
          </Container>
        </Box>
      </Box>
    </Fragment>
  );
}

export default Product;
