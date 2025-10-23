import { Fragment } from "react/jsx-runtime";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Outlet } from "react-router-dom";

import Breadcrumb from "~/client/components/Breadcrumb";
import { ProfileMenu } from "~/client/components/ProfileMenu";

const ProfleLayout = () => {
  const listBreadcrumb = [
    {
      title: "Trang Chủ",
      url: "/",
    },
    {
      title: "Hồ Sơ",
      url: `/me`,
    },
  ];

  return (
    <Fragment>
      <Breadcrumb listBreadcrumb={listBreadcrumb} />
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
          <Typography variant="h1" textAlign={"center"} my={2}>
            Hồ Sơ Của Tôi
          </Typography>
          <Grid container>
            <Grid size={{ xs: 12, md: 3 }}>
              <ProfileMenu />
            </Grid>
            <Grid size={{ xs: 12, md: 9 }}>
              <Outlet />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Fragment>
  );
};

export default ProfleLayout;
