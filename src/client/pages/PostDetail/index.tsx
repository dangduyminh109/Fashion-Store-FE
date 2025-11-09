import { Box, Typography } from "@mui/material";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { useContext, useEffect, useState } from "react";

import type { RootState } from "~/client/store";
import axiosClient from "~/client/hooks/useFetch";
import BreadcrumbContext from "~/client/context/BreadcrumbContext";
import type PostFeatured from "~/client/types/postFeatured";
function PostDetail() {
  const { setBreadcrumb } = useContext(BreadcrumbContext);
  const { slug } = useParams();

  useEffect(() => {
    const listBreadcrumb = [
      {
        title: "Trang Chủ",
        url: "/",
      },
      {
        title: "Bài viết",
        url: `/post`,
      },
    ];
    setBreadcrumb(listBreadcrumb);
  }, []);

  const [post, setPost] = useState<PostFeatured | null>(null);
  const { listPost } = useSelector((state: RootState) => state.post);

  useEffect(() => {
    let postItem = listPost.find((item) => item.slug === slug);
    if (postItem) {
      setPost(postItem);
      const listBreadcrumb = [
        {
          title: "Trang Chủ",
          url: "/",
        },
        {
          title: "Bài viết",
          url: `/post`,
        },
        {
          title: `${postItem.title}`,
          url: `/post` + slug,
        },
      ];
      setBreadcrumb(listBreadcrumb);
    } else {
      const fetchData = async () => {
        try {
          const post = await axiosClient.get("/post/" + slug);
          if (post.data.code == 1000) {
            setPost(post.data.result);
            const listBreadcrumb = [
              {
                title: "Trang Chủ",
                url: "/",
              },
              {
                title: "Bài viết",
                url: `/post`,
              },
              {
                title: `${post.data.result.title}`,
                url: `/post` + slug,
              },
            ];
            setBreadcrumb(listBreadcrumb);
          }
        } catch (error: any) {
          if (error.response?.data?.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Tải dử liệu bài viết không thành công! Có lỗi xãy ra!");
          }
        }
      };
      fetchData();
    }
  }, [listPost]);

  return (
    <Fragment>
      <Box
        component="section"
        id="list-post"
        sx={{
          width: "100%",
          py: 1,
          overflow: "hidden",
          bgcolor: "background.default",
        }}
      >
        {post ? (
          <Fragment>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 3,
                color: "text.default",
              }}
            >
              {post.title}
            </Typography>
            <Box
              sx={{
                "& img": {
                  maxWidth: "100%",
                  height: "auto",
                },
              }}
            >
              <Box dangerouslySetInnerHTML={{ __html: post.content }} />
            </Box>
          </Fragment>
        ) : (
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "text.default",
            }}
          >
            Tải dử liệu bài viết không thành công!
          </Typography>
        )}
      </Box>
    </Fragment>
  );
}

export default PostDetail;
