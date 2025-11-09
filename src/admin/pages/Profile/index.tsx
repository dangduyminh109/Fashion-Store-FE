import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { Grid, Typography } from "@mui/material";
import { Fragment, useContext } from "react";

import Breadcrumb from "~/admin/components/Breadcrumb";
import { AuthContext } from "~/admin/context/AuthContext";
import defaultImg from "~/assets/images/default-image.png";
const listBreadcrumb = [
  {
    title: "Hồ Sơ Của Tôi",
    url: "/admin/profile",
  },
];

const Profile = () => {
  const { user } = useContext(AuthContext);
  return (
    <Fragment>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Hồ Sơ" />
      <Grid container sx={{ bgcolor: "primary.main", p: 3, borderRadius: 2 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            component={"img"}
            src={user?.avatar || defaultImg}
            sx={{
              mb: 2,
              width: "60%",
              maxWidth: "300px",
              aspectRatio: "1/1",
              borderRadius: "50%",
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 8 }} container spacing={1}>
          <Grid size={{ xs: 12 }}>
            <Typography variant="h3" sx={{ my: 1 }}>
              Thông Tin cá nhân
            </Typography>
            <Divider sx={{ background: "#fff" }} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: "flex", gap: "5px", mb: { xs: 3, md: 5 } }}>
              <Typography variant="body1">Họ:</Typography>
              <Box component="strong">{user?.lastName || "Chưa cập nhật"}</Box>
            </Box>
            <Box sx={{ display: "flex", gap: "5px", mb: { xs: 3, md: 5 } }}>
              <Typography variant="body1">Tên:</Typography>
              <Box component="strong">{user?.firstName || "Chưa cập nhật"}</Box>
            </Box>
            <Box sx={{ display: "flex", gap: "5px", mb: { xs: 3, md: 5 } }}>
              <Typography variant="body1">Tên đăng nhập:</Typography>
              <Box component="strong">{user?.username || "Chưa cập nhật"}</Box>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: "flex", gap: "5px", mb: { xs: 3, md: 5 } }}>
              <Typography variant="body1">Email:</Typography>
              <Box component="strong">{user?.email || "Chưa cập nhật"}</Box>
            </Box>
            <Box sx={{ display: "flex", gap: "5px", mb: { xs: 3, md: 5 } }}>
              <Typography variant="body1">Số Điện thoại:</Typography>
              <Box component="strong">{user?.phone || "Chưa cập nhật"}</Box>
            </Box>
            <Box sx={{ display: "flex", gap: "5px", mb: { xs: 3, md: 5 } }}>
              <Typography variant="body1">Vai trò:</Typography>
              <Box component="strong">{user?.roleName || "Chưa cập nhật"}</Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Profile;
