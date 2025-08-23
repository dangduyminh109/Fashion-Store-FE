import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
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
    <Box>
      <Typography variant="h2" sx={{ color: "text.primary", fontWeight: 500 }}>
        {title}
      </Typography>
      <Breadcrumbs aria-label="breadcrumb">
        {listBreadcrumb.map((route) => {
          return (
            <Link to={route.url} key={route.url}>
              <Box
                component={"p"}
                sx={{
                  ":hover": {
                    color: "secondary.light",
                  },
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

export default Breadcrumb;
