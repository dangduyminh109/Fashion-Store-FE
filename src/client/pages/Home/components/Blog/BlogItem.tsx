import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Link } from "react-router-dom";
import defaultImg from "~/assets/images/default-image.png";

import PrimaryButton from "~/client/components/PrimaryButton";

interface Props {
  thumbnail?: string;
}

export const BlogItem = (props: Props) => {
  return (
    <Card
      sx={{
        bgcolor: "background.default",
        "& .blog-img": {
          display: "block",
          width: "100%",
          aspectRatio: "1/0.6",
          overflow: "hidden",
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
      }}
    >
      <Link to={"/"} className="blog-img">
        <img src={props.thumbnail || defaultImg} alt="ảnh bài viết" />
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
            Top 5 xe đạp thể thao chính hãng không thể bỏ qua
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
          Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
          across all continents except Antarctica Lizards are a widespread group of squamate
          reptiles, with over 6,000 species, ranging across all continents except Antarctica
        </Typography>
      </CardContent>
      <CardActions sx={{ padding: "0 16px 16px" }}>
        <PrimaryButton sx={{ padding: "3px 15px" }}>Xem thêm</PrimaryButton>
      </CardActions>
    </Card>
  );
};
