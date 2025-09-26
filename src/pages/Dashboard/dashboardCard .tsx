import Typography from "@mui/material/Typography";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import DescriptionIcon from "@mui/icons-material/Description";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import type DashboardResponse from "~/types/dashboard";
const cardStyle = {
  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
  padding: "20px",
  borderRadius: "10px",
  color: "#000",
};
const cardIconStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#fff",
  borderRadius: "50%",
  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
  padding: "15px",
  "& .MuiSvgIcon-root": {
    color: "#000",
  },
};

function percentage(current: number, prev: number) {
  return Math.round(((current - prev) / prev) * 100);
}

export const DashboardCard = ({ data }: { data: DashboardResponse }) => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={[cardStyle, { backgroundColor: "#F4F2FF" }]}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
          }}
        >
          <Box>
            <Typography variant="h5" fontSize={"2rem"}>
              Đơn Hàng
            </Typography>
            <Box
              component={"strong"}
              sx={{
                fontSize: "2.5rem",
              }}
            >
              {data.totalOrder ? data.totalOrder : 0}
            </Box>
          </Box>
          <Box sx={cardIconStyle}>
            <ShoppingBasketIcon fontSize="large" />
          </Box>
        </Box>
        <Box display={"flex"} mt={1} columnGap={2} flexWrap={"wrap"}>
          {percentage(data.totalOrder, data.totalOrderPrev) > 0 ? (
            <Box display={"flex"} sx={{ "& *": { color: "success.main" } }}>
              <ArrowUpwardIcon fontSize="large" />
              <Typography variant="body1">
                {Math.abs(percentage(data.totalOrder, data.totalOrderPrev)) > 1000
                  ? `+1000%`
                  : `${Math.abs(percentage(data.totalOrder, data.totalOrderPrev))}%`}
              </Typography>
            </Box>
          ) : (
            <Box display={"flex"} sx={{ "& *": { color: "error.main" } }}>
              <ArrowDownwardIcon fontSize="large" />
              <Typography variant="body1">
                {Math.abs(percentage(data.totalOrder, data.totalOrderPrev)) > 1000
                  ? `-1000%`
                  : `${Math.abs(percentage(data.totalOrder, data.totalOrderPrev))}%`}
              </Typography>
            </Box>
          )}
          <Typography variant="body1">Kể từ tháng trước</Typography>
        </Box>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={[cardStyle, { backgroundColor: "#FFF2EC" }]}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
          }}
        >
          <Box>
            <Typography variant="h5" fontSize={"2rem"}>
              Khách Hàng
            </Typography>
            <Box
              component={"strong"}
              sx={{
                fontSize: "2.5rem",
              }}
            >
              {data.totalCustomer ? data.totalCustomer : 0}
            </Box>
          </Box>
          <Box sx={cardIconStyle}>
            <GroupAddIcon fontSize="large" />
          </Box>
        </Box>
        <Box display={"flex"} mt={1} columnGap={2} flexWrap={"wrap"}>
          {percentage(data.totalCustomer, data.totalCustomerPrev) > 0 ? (
            <Box display={"flex"} sx={{ "& *": { color: "success.main" } }}>
              <ArrowUpwardIcon fontSize="large" />
              <Typography variant="body1">
                {Math.abs(percentage(data.totalCustomer, data.totalCustomerPrev)) > 1000
                  ? `+1000%`
                  : `${Math.abs(percentage(data.totalCustomer, data.totalCustomerPrev))}%`}
              </Typography>
            </Box>
          ) : (
            <Box display={"flex"} sx={{ "& *": { color: "error.main" } }}>
              <ArrowDownwardIcon fontSize="large" />
              <Typography variant="body1">
                {Math.abs(percentage(data.totalCustomer, data.totalCustomerPrev)) > 1000
                  ? `-1000%`
                  : `${Math.abs(percentage(data.totalCustomer, data.totalCustomerPrev))}%`}
              </Typography>
            </Box>
          )}
          <Typography variant="body1">Kể từ tháng trước</Typography>
        </Box>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={[cardStyle, { backgroundColor: "#ECFBFF" }]}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
          }}
        >
          <Box>
            <Typography variant="h5" fontSize={"2rem"}>
              Bài Viết
            </Typography>
            <Box
              component={"strong"}
              sx={{
                fontSize: "2.5rem",
              }}
            >
              {data.totalPost ? data.totalPost : 0}
            </Box>
          </Box>
          <Box sx={cardIconStyle}>
            <DescriptionIcon fontSize="large" />
          </Box>
        </Box>
        <Box display={"flex"} mt={1} columnGap={2} flexWrap={"wrap"}>
          {percentage(data.totalPost, data.totalPostPrev) > 0 ? (
            <Box display={"flex"} sx={{ "& *": { color: "success.main" } }}>
              <ArrowUpwardIcon fontSize="large" />
              <Typography variant="body1">
                {Math.abs(percentage(data.totalPost, data.totalPostPrev)) > 1000
                  ? `+1000%`
                  : `${Math.abs(percentage(data.totalPost, data.totalPostPrev))}%`}
              </Typography>
            </Box>
          ) : (
            <Box display={"flex"} sx={{ "& *": { color: "error.main" } }}>
              <ArrowDownwardIcon fontSize="large" />
              <Typography variant="body1">
                {Math.abs(percentage(data.totalPost, data.totalPostPrev)) > 1000
                  ? `-1000%`
                  : `${Math.abs(percentage(data.totalPost, data.totalPostPrev))}%`}
              </Typography>
            </Box>
          )}
          <Typography variant="body1">Kể từ tháng trước</Typography>
        </Box>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }} sx={[cardStyle, { backgroundColor: "#FEEFD0" }]}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
          }}
        >
          <Box>
            <Typography variant="h5" fontSize={"2rem"}>
              Doanh Thu
            </Typography>
            <Box
              component={"strong"}
              sx={{
                fontSize: "2.5rem",
              }}
            >
              {data.totalRevenue ? data.totalRevenue.toLocaleString("vi-VN") : 0}đ
            </Box>
          </Box>
          <Box sx={cardIconStyle}>
            <AttachMoneyIcon fontSize="large" />
          </Box>
        </Box>
        <Box display={"flex"} mt={1} columnGap={2} flexWrap={"wrap"}>
          {percentage(data.totalRevenue, data.totalRevenuePrev) > 0 ? (
            <Box display={"flex"} sx={{ "& *": { color: "success.main" } }}>
              <ArrowUpwardIcon fontSize="large" />
              <Typography variant="body1">
                {Math.abs(percentage(data.totalRevenue, data.totalRevenuePrev)) > 1000
                  ? `+1000%`
                  : `${Math.abs(percentage(data.totalRevenue, data.totalRevenuePrev))}%`}
              </Typography>
            </Box>
          ) : (
            <Box display={"flex"} sx={{ "& *": { color: "error.main" } }}>
              <ArrowDownwardIcon fontSize="large" />
              <Typography variant="body1">
                {Math.abs(percentage(data.totalRevenue, data.totalRevenuePrev)) > 1000
                  ? `-1000%`
                  : `${Math.abs(percentage(data.totalRevenue, data.totalRevenuePrev))}%`}
              </Typography>
            </Box>
          )}
          <Typography variant="body1">Kể từ tháng trước</Typography>
        </Box>
      </Grid>
    </Grid>
  );
};
