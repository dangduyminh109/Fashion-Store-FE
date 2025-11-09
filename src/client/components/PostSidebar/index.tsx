import Box from "@mui/material/Box";
import * as React from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Link, useNavigate } from "react-router-dom";
import TopicIcon from "@mui/icons-material/Topic";
import ArticleIcon from "@mui/icons-material/Article";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Typography from "@mui/material/Typography";

import { useFetch } from "~/client/hooks/useFetch";
import type Topic from "~/client/types/topic";
import type { AppDispatch, RootState } from "~/client/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchPost } from "~/client/features/post/postApi";
import { setTitle, setTopicId } from "~/client/features/post/postSlice";
export const PostSidebar = () => {
  const [openTopic, setOpenTopic] = React.useState(true);
  const [openNewPost, setOpenNewPost] = React.useState(true);
  const navigate = useNavigate();
  const { data, loading, error } = useFetch<Topic[]>({
    endpoint: "/topic",
    method: "get",
  });

  const dispatch = useDispatch<AppDispatch>();
  const {
    listPost,
    size,
    page,
    loading: postLoading,
    error: postError,
  } = useSelector((state: RootState) => state.post);

  useEffect(() => {
    if (listPost.length < size) {
      dispatch(fetchPost({ url: `/post?page=${page}&size=${size}`, method: "get" }));
    }
  }, []);

  function handleSelectTopic(item?: Topic) {
    if (item) {
      dispatch(setTopicId(item.id));
      dispatch(setTitle(item.name));
      let url = `/post?page=${page}&size=${size}`;
      if (item.id) {
        url += `&topicIds=${item.id}`;
      }
      dispatch(fetchPost({ url, method: "get" }));
    } else {
      dispatch(setTopicId(null));
      dispatch(setTitle("Danh Sách Bài Viết"));
      let url = `/post?page=${page}&size=${size}`;
      dispatch(fetchPost({ url, method: "get" }));
    }
    navigate("/post");
  }

  return (
    <Box>
      {!loading && !error && (
        <List
          sx={{
            width: "100%",
            "& .MuiListItemIcon-root": {
              minWidth: "30px",
            },
          }}
        >
          <ListItemButton
            sx={{ p: "10px 5px" }}
            onClick={() => {
              setOpenTopic(!openTopic);
            }}
          >
            <ListItemIcon>
              <TopicIcon />
            </ListItemIcon>
            <ListItemText primary="Chủ Đề" />
            {openTopic ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openTopic} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} onClick={() => handleSelectTopic()}>
                <ListItemText primary={"Tất cả"} />
              </ListItemButton>
              {data &&
                data.map((item) => {
                  return (
                    <ListItemButton
                      sx={{ pl: 4 }}
                      onClick={() => handleSelectTopic(item)}
                      key={item.id}
                    >
                      <ListItemText primary={item.name} />
                    </ListItemButton>
                  );
                })}
            </List>
          </Collapse>
        </List>
      )}
      {postLoading == "succeeded" && !postError && (
        <List
          sx={{
            width: "100%",
            "& .MuiListItemIcon-root": {
              minWidth: "30px",
            },
          }}
        >
          <ListItemButton
            sx={{ p: "10px 5px" }}
            onClick={() => {
              setOpenNewPost(!openNewPost);
            }}
          >
            <ListItemIcon>
              <ArticleIcon />
            </ListItemIcon>
            <ListItemText primary="Bài Viết Mới Nhất" />
            {openNewPost ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openNewPost} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {listPost &&
                [...listPost.slice(0, 5)].map((item) => {
                  return (
                    <Link to={"/post/" + item.slug} key={item.id}>
                      <Box
                        key={item.id}
                        sx={{ display: "flex", alignItems: "center", gap: 1, p: "5px" }}
                      >
                        <Box
                          component={"img"}
                          src={item.image}
                          sx={{ height: "60px", width: "40%", objectFit: "cover" }}
                        ></Box>
                        <Box>
                          <Typography
                            variant="body1"
                            sx={{
                              display: "-webkit-box",
                              webkitLineClamp: "3",
                              overflow: "hidden",
                              WebkitBoxOrient: "vertical",
                              textOverflow: "ellipsis",
                              "&:hover": {
                                color: "secodary.main",
                              },
                            }}
                          >
                            {item.title}
                          </Typography>
                          <Typography variant="body2" display={"flex"} alignItems={"center"}>
                            <CalendarMonthIcon />
                            {new Date(item.createdAt).toLocaleDateString("vi-VN")}
                          </Typography>
                        </Box>
                      </Box>
                    </Link>
                  );
                })}
            </List>
          </Collapse>
        </List>
      )}
    </Box>
  );
};
