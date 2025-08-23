import React from "react";
import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { Link } from "react-router-dom";

import type { SvgIconProps } from "@mui/material/SvgIcon";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import Popper from "@mui/material/Popper";
import menuItem from "./menuItem";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";

interface listItem {
  title: string;
  icon?: ReactElement<SvgIconProps>;
  to?: string;
  children?: listItem[];
  id: string;
}
const listMenuItem: listItem[] = [...menuItem];
const ListSidebarItem = ({ isShow }: { isShow: boolean }) => {
  const [activeId, setActiveId] = useState(
    JSON.parse(localStorage.getItem("SidebarActiveItem") || '"tong-quan"')
  );
  const [openId, setOpenId] = useState(() => {
    const parent = menuItem.find((i) => i.children?.some((c) => c.id === activeId));
    return parent ? parent.id : null;
  });
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>();
  const [openCollapse, setOpenCollapse] = useState(false);
  function handleActive(item: listItem) {
    localStorage.setItem("SidebarActiveItem", JSON.stringify(item.id));
    setActiveId(item.id);
  }
  function handleOpenId(event: React.MouseEvent<HTMLElement>, id: string) {
    setAnchorEl(event.currentTarget);
    setOpenId(id === openId ? null : id);
  }
  useEffect(() => {
    setOpenId(null);
    setOpenCollapse(false);
  }, [isShow]);

  return listMenuItem.map((item, index) => {
    let isActive = activeId.includes(item.id) || item?.children?.find((i) => i.id == activeId);
    let isOpen = openId === item.id;
    return (
      <React.Fragment key={item.id}>
        {item.children == null ? (
          <Link to={item.to || "/"} onClick={() => handleActive(item)}>
            <ListItemButton
              sx={{
                bgcolor: isActive ? "primary.light" : "primary.main",
                color: isActive ? "secondary.light" : "text.main",
                padding: "10px 16px",
              }}
              onClick={(e) => handleOpenId(e, item.id)}
            >
              <ListItemIcon sx={{ minWidth: "20px" }}>
                {item.icon &&
                  React.cloneElement(item.icon, {
                    sx: { color: isActive ? "secondary.light" : "text.primary" },
                  })}
              </ListItemIcon>
              {isShow && (
                <ListItemText primary={item.title} sx={{ m: "0 0 0 10px", whiteSpace: "nowrap" }} />
              )}
            </ListItemButton>
          </Link>
        ) : (
          <React.Fragment>
            <ListItemButton
              sx={{
                bgcolor: isActive ? "primary.light" : "primary.main",
                color: isActive ? "secondary.light" : "text.main",
                padding: "10px 16px",
              }}
              onClick={(e) => handleOpenId(e, item.id)}
              aria-describedby={`Popper-${item.id}`}
            >
              <ListItemIcon
                sx={{ minWidth: "20px", color: isActive ? "secondary.light" : "text.main" }}
              >
                {item.icon &&
                  React.cloneElement(item.icon, {
                    sx: { color: isActive ? "secondary.light" : "text.primary" },
                  })}
              </ListItemIcon>
              {isShow && (
                <>
                  <ListItemText
                    primary={item.title}
                    sx={{
                      m: "0 0 0 10px",
                      color: isActive ? "secondary.light" : "text.main",
                      whiteSpace: "nowrap",
                    }}
                  />
                  <ExpandMore
                    sx={{
                      transform: `${isOpen ? "rotate(0)" : "rotate(90deg)"}`,
                      transition: ".3s",
                      color: isActive ? "secondary.light" : "text.primary",
                    }}
                  />
                </>
              )}
            </ListItemButton>
            {isShow ? (
              <Collapse in={isOpen} timeout={"auto"}>
                {item.children.map((childItem) => {
                  isActive = childItem.id === activeId;
                  return (
                    <Link
                      to={childItem.to || "/"}
                      key={childItem.id}
                      onClick={() => handleActive(childItem)}
                    >
                      <ListItemButton
                        sx={{
                          pl: `${(index + 1) * 16}px`,
                          bgcolor: "primary.light",
                          padding: "10px 16px",
                        }}
                      >
                        {childItem.icon && (
                          <ListItemIcon sx={{ minWidth: "20px" }}>
                            {item.icon &&
                              React.cloneElement(childItem.icon, {
                                sx: { color: isActive ? "secondary.light" : "text.primary" },
                              })}
                          </ListItemIcon>
                        )}
                        {isShow && (
                          <ListItemText
                            primary={childItem.title}
                            sx={{
                              m: "0 0 0 10px",
                              color: isActive ? "secondary.light" : "text.main",
                              whiteSpace: "nowrap",
                            }}
                          />
                        )}
                      </ListItemButton>
                    </Link>
                  );
                })}
              </Collapse>
            ) : (
              <Box>
                <Popper
                  sx={{ zIndex: 1200 }}
                  open={isOpen}
                  placement={"right-start"}
                  transition
                  id={item.id}
                  anchorEl={anchorEl || null}
                >
                  {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                      <Box>
                        <ListItemButton
                          sx={{
                            bgcolor: "primary.light",
                            color: "secondary.light",
                            padding: "10px 16px",
                            minWidth: "200px",
                          }}
                          onClick={() => setOpenCollapse(!openCollapse)}
                          aria-describedby={`Popper-Collapse-${item.id}`}
                        >
                          <ListItemText
                            primary={item.title}
                            sx={{
                              m: "0 0 0 10px",
                              color: "secondary.light",
                              whiteSpace: "nowrap",
                            }}
                          />
                          <ExpandMore
                            sx={{
                              transform: `${openCollapse ? "rotate(0)" : "rotate(90deg)"}`,
                              transition: ".3s",
                              color: "secondary.light",
                            }}
                          />
                        </ListItemButton>
                        <Collapse in={openCollapse} timeout={"auto"}>
                          {item.children &&
                            item.children.map((childItem) => {
                              let isActive = childItem.id === activeId;
                              return (
                                <Link
                                  to={childItem.to || "/"}
                                  key={childItem.id}
                                  onClick={() => handleActive(childItem)}
                                >
                                  <ListItemButton
                                    sx={{ bgcolor: "primary.light", padding: "10px 16px" }}
                                  >
                                    {childItem.icon && (
                                      <ListItemIcon sx={{ minWidth: "20px" }}>
                                        {item.icon &&
                                          React.cloneElement(childItem.icon, {
                                            sx: {
                                              color: isActive ? "secondary.light" : "text.primary",
                                            },
                                          })}
                                      </ListItemIcon>
                                    )}
                                    <ListItemText
                                      primary={childItem.title}
                                      sx={{
                                        m: "0 0 0 10px",
                                        color: isActive ? "secondary.light" : "text.main",
                                        whiteSpace: "nowrap",
                                      }}
                                    />
                                  </ListItemButton>
                                </Link>
                              );
                            })}
                        </Collapse>
                      </Box>
                    </Fade>
                  )}
                </Popper>
              </Box>
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  });
};

export default ListSidebarItem;
