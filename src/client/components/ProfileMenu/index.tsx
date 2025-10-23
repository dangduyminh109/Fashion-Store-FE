import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { useContext } from "react";
import EditIcon from "@mui/icons-material/Edit";
import * as React from "react";
import PersonIcon from "@mui/icons-material/Person";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ReceiptIcon from "@mui/icons-material/Receipt";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SellIcon from "@mui/icons-material/Sell";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "~/client/context/AuthContext";
export const ProfileMenu = () => {
  const { customer } = useContext(AuthContext);
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const handleClick = () => {
    setOpen(!open);
  };
  return (
    <Box p={2}>
      <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <Avatar src={customer?.avatar || ""} />
        <Box>
          <Typography variant="body1" fontWeight={600}>
            {customer?.fullName}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              transition: "0.3s ease",
              "&:hover": {
                color: "secondary.main",
              },
            }}
          >
            <EditIcon />
            <Typography variant="body1">Chỉnh sửa</Typography>
          </Box>
        </Box>
      </Box>
      <List
        sx={{
          width: "100%",
          mt: 2,
          "& .MuiListItemIcon-root": {
            minWidth: "30px",
          },
        }}
      >
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="Tài Khoản" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate("/me")}>
              <ListItemText primary="Hồ Sơ" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={() => navigate("/me/address")}>
              <ListItemText primary="Địa Chỉ" />
            </ListItemButton>
          </List>
        </Collapse>
        <ListItemButton>
          <ListItemIcon>
            <ReceiptIcon />
          </ListItemIcon>
          <ListItemText primary="Đơn Mua" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <SellIcon />
          </ListItemIcon>
          <ListItemText primary="Voucher" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <NotificationsActiveIcon />
          </ListItemIcon>
          <ListItemText primary="Thông Báo" />
        </ListItemButton>
      </List>
    </Box>
  );
};
