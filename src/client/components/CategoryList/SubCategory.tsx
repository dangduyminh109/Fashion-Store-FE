import { Fragment } from "react/jsx-runtime";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

import { setCategory } from "~/client/features/product/productSlice";
import type CategoryTree from "~/client/types/categoryTree";
import type { AppDispatch, RootState } from "~/client/store";

export const SubCategory = ({ data }: { data: CategoryTree | undefined }) => {
  const navigate = useNavigate();
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

  function handleChooseCategory(id: number) {
    navigate(`/list-product`);
    dispatch(setCategory({ [String(id)]: true }));
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
                onClick={() => handleChooseCategory(category.id)}
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
