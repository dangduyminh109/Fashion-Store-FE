import { Fragment } from "react/jsx-runtime";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Outlet } from "react-router-dom";
import { PostSidebar } from "~/client/components/PostSidebar";

const PostLayout = () => {
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
          <Grid container spacing={4} sx={{ minHeight: "70vh" }}>
            <Grid size={{ xs: 12, md: 3.4 }}>
              <PostSidebar />
            </Grid>
            <Grid size={{ xs: 12, md: 8.6 }}>
              <Outlet />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Fragment>
  );
};

export default PostLayout;
