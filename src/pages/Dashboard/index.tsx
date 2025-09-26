import { Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CardHeader from "@mui/material/CardHeader";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CardContent from "@mui/material/CardContent";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";

import axiosClient from "~/hooks/useFetch";
import type DashboardResponse from "~/types/dashboard";
import defaultImage from "~/assets/images/default-image.png";
import { DashboardCard } from "./dashboardCard ";
import Breadcrumb from "~/components/Breadcrumb";

const listBreadcrumb = [
  {
    title: "Tổng Quan",
    url: "/",
  },
];
const xLabels = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];

function Dashboard() {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<DashboardResponse | null>(null);
  useEffect(() => {
    setLoading(true);
    try {
      (async () => {
        const data: DashboardResponse = (await axiosClient.get("/dashboard")).data.result;
        setData(data);
      })();
    } catch (error) {
      toast.error("Tải dử liệu không thành công! vui lòng reload lại trang hoặc thử lại sau!");
    } finally {
      setLoading(false);
    }
  }, []);

  const today = new Date();
  const year = today.getFullYear();

  function handlePieChartData() {
    if (data != null) {
      let PieChartData: { id: number; value: number; label: string }[] = [];
      let k = 0;
      for (let key in data?.topCategory) {
        PieChartData.push({
          id: k,
          value: data.topCategory[key],
          label: key,
        });
        k++;
      }
      return PieChartData;
    } else {
      return [];
    }
  }

  function handleColorStatus(status: string): { label: string; color: string } {
    switch (status) {
      case "CONFIRMED":
        return {
          label: "Đã xác nhận",
          color: "#3B82F6",
        };
      case "PROCESSING":
        return {
          label: "Đang xử lí",
          color: "#FEEFD0",
        };
      case "SHIPPING":
        return {
          label: "Đang giao",
          color: "#F4F2FF",
        };
      case "DELIVERED":
        return {
          label: "Đã nhận",
          color: "#10B981",
        };
      case "CANCELLED":
        return {
          label: "Đã hủy",
          color: "#F59E0B",
        };
      default:
        return {
          label: "Chờ xác nhận",
          color: "#FFF2EC",
        };
        break;
    }
  }
  return (
    <Fragment>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Tổng Quan" />
      {loading && (
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

      {!loading && data && (
        <Fragment>
          <DashboardCard data={data} />
          <Grid container mt={4} spacing={4}>
            <Grid
              size={{ xs: 12, md: 8 }}
              sx={{
                p: 2,
                borderRadius: "10px",
                backgroundColor: "background.paper",
                height: "350px",
              }}
            >
              <BarChart
                series={[
                  { data: data.monthlyRevenue || [], label: year.toString(), id: "currentYear" },
                  {
                    data: data.monthlyRevenuePrev || [],
                    label: (year - 1).toString(),
                    id: "prevYear",
                  },
                ]}
                xAxis={[{ data: xLabels }]}
                yAxis={[{ width: 50 }]}
              />
            </Grid>
            <Grid
              size={{ xs: 6, md: 4 }}
              sx={{
                p: 2,
                borderRadius: "10px",
                backgroundColor: "background.paper",
                height: "350px",
              }}
            >
              <PieChart
                series={[
                  {
                    data: handlePieChartData(),
                  },
                ]}
              />
            </Grid>
            <Grid
              size={{ xs: 6, md: 4 }}
              sx={{
                p: 2,
                borderRadius: "10px",
                backgroundColor: "background.paper",
              }}
              component={Card}
            >
              <CardHeader
                title="Khách hàng"
                sx={{ padding: "5px 10px", "& *": { fontSize: "2.5rem", fontWeight: 500 } }}
              />
              <CardContent sx={{ p: 0 }}>
                <List
                  sx={{
                    width: "100%",
                    maxHeight: "300px",
                    overflow: "auto",
                    bgcolor: "background.paper",
                    p: 0,
                  }}
                >
                  {data?.customerList.map((customer, idx) => {
                    return (
                      <ListItem key={idx} sx={{ pt: 0 }}>
                        <Box
                          sx={{
                            height: "35px",
                            aspectRatio: "1/1",
                            borderRadius: "50%",
                            overflow: "hidden",
                            border: "1px solid #000",
                            mr: "10px",
                            "& img": {
                              height: "100%",
                              width: "100%",
                              objectFit: "cover",
                            },
                          }}
                        >
                          {customer.avatar ? (
                            <img src={customer.avatar} alt="avatar" />
                          ) : (
                            <img src={defaultImage} alt="avatar" />
                          )}
                        </Box>

                        <ListItemText
                          primary={customer.fullName}
                          secondary={new Date(customer.createdAt).toLocaleString("vi-VN")}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </CardContent>
            </Grid>
            <Grid
              size={{ xs: 12, md: 8 }}
              sx={{
                p: 2,
                borderRadius: "10px",
                backgroundColor: "background.paper",
              }}
              component={Card}
            >
              <CardHeader
                title="Đơn hàng"
                sx={{ padding: "5px 10px", "& *": { fontSize: "2.5rem", fontWeight: 500 } }}
              />
              <CardContent sx={{ p: 0 }}>
                <TableContainer
                  component={Paper}
                  sx={{ maxHeight: "300px", overflow: "auto", boxShadow: "none" }}
                >
                  <Table sx={{ minWidth: 600 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Khách Hàng</TableCell>
                        <TableCell align="right">Tổng Tiền</TableCell>
                        <TableCell align="right">Ngày Tạo</TableCell>
                        <TableCell align="right">Số Lượng SP</TableCell>
                        <TableCell align="right">Trạng Thái</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.orderList.map((order, idx) => (
                        <TableRow
                          key={idx}
                          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {order.customerName}
                          </TableCell>
                          <TableCell align="right">
                            {order.totalAmount.toLocaleString("vi-VN")}đ
                          </TableCell>
                          <TableCell align="right">
                            {new Date(order.createdAt).toLocaleString("vi-VN")}
                          </TableCell>
                          <TableCell align="right">{order.numOfProduct}</TableCell>
                          <TableCell align="right">
                            <Box
                              component="span"
                              sx={{
                                backgroundColor: handleColorStatus(order.orderStatus).color,
                                padding: "5px",
                                borderRadius: "5px",
                                boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
                                display: "inline-block",
                                width: "100px",
                                textAlign: "center",
                                whiteSpace: "nowrap",
                                color: "#000",
                              }}
                            >
                              {handleColorStatus(order.orderStatus).label}
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Grid>
          </Grid>
        </Fragment>
      )}
    </Fragment>
  );
}
export default Dashboard;
