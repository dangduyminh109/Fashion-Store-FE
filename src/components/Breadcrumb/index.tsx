import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { memo } from "react";
interface listBreadcrumb {
  title: string;
  url: string;
}

const Breadcrumb = ({
  title,
  listBreadcrumb,
}: {
  title: string;
  listBreadcrumb: listBreadcrumb[];
}) => {
  return (
    <Box sx={{ mb: "20px" }}>
      <Typography
        variant="h2"
        sx={{ color: "text.primary", fontWeight: 500, textTransform: "capitalize" }}
      >
        {title}
      </Typography>
      <Divider sx={{ m: "5px 0", bgcolor: "text.primary" }} />
      <Breadcrumbs
        aria-label="breadcrumb"
        sx={{
          "li:last-child p": {
            color: "text.secondary",
          },
        }}
      >
        {listBreadcrumb.map((route) => {
          return (
            <Link to={route.url} key={route.url}>
              <Box
                component={"p"}
                sx={{
                  color: "text.primary",
                  ":hover": {
                    color: "text.secondary",
                  },
                  textTransform: "capitalize",
                }}
              >
                {route.title}
              </Box>
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default memo(Breadcrumb);
