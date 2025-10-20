import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";

interface listBreadcrumb {
  title: string;
  url: string;
}

const Breadcrumb = ({ listBreadcrumb }: { listBreadcrumb: listBreadcrumb[] }) => {
  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
        bgcolor: "background.paper",
        position: "sticky",
        top: "45px",
        zIndex: 110,
      }}
    >
      <Box
        sx={{
          width: "80%",
          height: "45px",
          margin: "0 auto",
          overflow: "auto",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{
            "li:last-child p": {
              cursor: "default",
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
                    color: "text.secondary",
                    transition: "ease 0.3s",
                    ":hover": {
                      color: "secondary.main",
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
    </Box>
  );
};

export default Breadcrumb;
