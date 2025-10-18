import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Link } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import VisibilityIcon from "@mui/icons-material/Visibility";

import defaultImg from "~/assets/images/default-image.png";
import PrimaryButton from "~/client/components/PrimaryButton";
import type PostFeatured from "~/client/types/PostFeatured";
function truncateHtmlText(html: string, wordLimit = 20) {
  if (!html) return "";

  const div = document.createElement("div");
  div.innerHTML = html;
  const text = div.textContent || div.innerText || "";

  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  const decoded = textarea.value;

  const words = decoded.trim().split(/\s+/);
  if (words.length <= wordLimit) return decoded;

  return words.slice(0, wordLimit).join(" ") + "...";
}

export const BlogItem = ({ data }: { data: PostFeatured }) => {
  return (
    <Card
      sx={{
        bgcolor: "background.default",
        height: "100%",
        "& .blog-img": {
          display: "block",
          width: "100%",
          aspectRatio: "1/0.6",
          overflow: "hidden",
          position: "relative",
        },
        "& .blog-img img": {
          transition: "0.3s",
          height: "100%",
          width: "100%",
          objectFit: "cover",
        },
        "&:hover .blog-img img": {
          transform: "scale(1.1, 1.1)",
        },
        "& .card-hover__btn": {
          opacity: 0,
          transform: "translate(-50%, -30%)",
          transition: "0.3s ease",
        },
        "&:hover .card-hover__btn": {
          opacity: 1,
          transform: "translate(-50%, -50%)",
        },
      }}
    >
      <Link to={"/"} className="blog-img">
        <img src={data.image || defaultImg} alt="ảnh bài viết" />
        <Box
          className="card-hover__btn"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
          }}
        >
          <IconButton
            sx={{
              color: "text.secondary",
              bgcolor: "primary.main",
              "&:hover": {
                bgcolor: "secondary.main",
              },
            }}
            aria-label="view product"
          >
            <VisibilityIcon />
          </IconButton>
        </Box>
      </Link>
      <CardContent>
        <Link to={"/"}>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              textOverflow: "ellipsis",
              transition: "0.3s",
              "&:hover": {
                color: "secondary.main",
              },
            }}
          >
            {data.title}
          </Typography>
        </Link>
        <Typography variant="body2" display={"flex"} alignItems={"center"}>
          <CalendarMonthIcon />
          15/07/2024
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "text.primary",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            textOverflow: "ellipsis",
          }}
        >
          {truncateHtmlText(data.content, 20)}
        </Typography>
      </CardContent>
      <CardActions sx={{ padding: "0 16px 16px" }}>
        <PrimaryButton sx={{ padding: "3px 15px" }}>Xem thêm</PrimaryButton>
      </CardActions>
    </Card>
  );
};
