import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Fragment, useLayoutEffect, useState } from "react";
import { gsap } from "gsap";
import { useContext, useEffect } from "react";
import Pagination from "@mui/material/Pagination";
import { useDispatch, useSelector } from "react-redux";

import BreadcrumbContext from "~/client/context/BreadcrumbContext";
import type { AppDispatch, RootState } from "~/client/store";
import { setPage } from "~/client/features/post/postSlice";
import { PostItem } from "~/client/components/PostItem";
import { fetchPost, refillPost } from "~/client/features/post/postApi";
import type PostFeatured from "~/client/types/postFeatured";

function Post() {
  const [listDisplayPost, setListDisplayPost] = useState<PostFeatured[]>([]);
  const { setBreadcrumb } = useContext(BreadcrumbContext);
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

  const dispatch = useDispatch<AppDispatch>();
  const {
    listPost,
    size,
    totalPage,
    title,
    page,
    topicId,
    loading: postLoading,
    error: postError,
  } = useSelector((state: RootState) => state.post);

  useLayoutEffect(() => {
    if (!listPost || postLoading || postError) return;
    const ctx = gsap.context(() => {
      gsap.from("#list-post .card-item-wrapper", {
        scrollTrigger: {
          trigger: "#post",
          start: "top 50%",
          toggleActions: "play none none none",
          once: true,
        },
        y: 50,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.3,
        ease: "power2.out",
      });
    });
    return () => ctx.revert();
  }, [listPost, postLoading, postError]);

  useEffect(() => {
    if (listPost.length < size) {
      dispatch(fetchPost({ url: `/post?page=${page}&size=${size}`, method: "get" }));
    }
  }, []);

  useEffect(() => {
    let data = [];
    for (let index = page * size; index < listPost.length && data.length < size; index++) {
      data.push(listPost[index]);
    }
    setListDisplayPost(data);
  }, [listPost, page]);

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    let url = `/post?page=${value - 1}&size=${size}`;

    if (topicId) {
      url = url + `&topicIds=` + topicId;
    }
    if (value * size >= listPost.length + size) {
      dispatch(refillPost({ url, method: "get" }));
    } else {
      dispatch(setPage(value - 1));
    }
  };

  return (
    <Fragment>
      {!postError && (
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
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 4,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                color: "text.default",
                textTransform: "capitalize",
              }}
            >
              {title}
            </Typography>
          </Box>
          {postLoading == "succeeded" && !postError && listDisplayPost && (
            <Fragment>
              <Grid container spacing={1} alignItems={"stretch"}>
                {listDisplayPost && listDisplayPost.length > 0 ? (
                  listDisplayPost.map((post) => {
                    return (
                      <Grid size={{ xs: 6, md: 4 }} className="card-item-wrapper" key={post.id}>
                        <PostItem data={post} />
                      </Grid>
                    );
                  })
                ) : (
                  <Typography
                    variant="body1"
                    sx={{
                      mx: "auto",
                      color: "text.default",
                      textTransform: "capitalize",
                    }}
                  >
                    Không có bài viết nào!!!
                  </Typography>
                )}
              </Grid>
              <Pagination
                onChange={handleChange}
                page={page + 1}
                count={totalPage}
                showFirstButton
                showLastButton
                variant="outlined"
                shape="rounded"
                sx={{
                  mt: 3,
                  "& .MuiPagination-ul": {
                    justifyContent: "center",
                  },
                }}
              />
            </Fragment>
          )}
        </Box>
      )}
    </Fragment>
  );
}

export default Post;
