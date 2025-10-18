import { Fragment } from "react/jsx-runtime";
import type CategoryTree from "~/client/types/categoryTree";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "~/client/store";

import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";

export const SubCategory = ({ data }: { data: CategoryTree | undefined }) => {
  const dispatch = useDispatch<AppDispatch>();
  let categoryList: CategoryTree[] = data?.children || [];

  if (!categoryList || categoryList.length === 0) {
    const { categoryData } = useSelector((state: RootState) => state.navbar);
    categoryList = categoryData || [];
  }

  function handleChangeSidebar(subCategories: CategoryTree | undefined) {
    if (subCategories?.children && subCategories.children.length > 0) {
      dispatch({ type: "sidebar/changeCurrentCategory", payload: subCategories });
    }
  }

  return (
    <Fragment>
      {categoryList &&
        categoryList.map((category) => {
          return (
            <ListItem
              key={category.id}
              secondaryAction={
                category.children && category.children.length > 0 ? (
                  <IconButton
                    edge="end"
                    aria-label="comments"
                    onClick={() => handleChangeSidebar(category)}
                    sx={{
                      "&:hover": {
                        bgcolor: "secondary.main",
                        "& .MuiSvgIcon-root": {
                          color: "text.secondary",
                        },
                      },
                    }}
                  >
                    <AddIcon color="secondary" />
                  </IconButton>
                ) : undefined
              }
              disablePadding
            >
              <ListItemButton
                sx={{
                  pl: 4,
                  color: "text.secondary",
                  "& .first-icon": {
                    transition: "0.2s ease-in-out",
                  },
                  "&:hover .first-icon": {
                    transform: "translateX(8px)",
                  },
                }}
              >
                <ListItemIcon
                  className="first-icon"
                  sx={{
                    minWidth: "0",
                    mr: "15px",
                  }}
                >
                  <ArrowForwardIcon color="secondary" />
                </ListItemIcon>
                <ListItemText primary={category.name} />
              </ListItemButton>
            </ListItem>
          );
        })}
    </Fragment>
  );
};
