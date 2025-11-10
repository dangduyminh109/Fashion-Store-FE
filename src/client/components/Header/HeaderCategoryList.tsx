import Box from "@mui/material/Box";
import { Fragment, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "~/client/store";
import { fetchSidebar } from "~/client/features/sidebar/sidebarApi";
import type CategoryTree from "~/client/types/categoryTree";
import { setCategory } from "~/client/features/product/productSlice";

function SubCategoryList({ subCategory, index }: { subCategory: CategoryTree; index: number }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function handleChooseCategory(
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    subCategory: CategoryTree
  ) {
    e.preventDefault();
    dispatch(setCategory({ [String(subCategory.id)]: true }));
    navigate(`/list-product`);
  }
  return (
    <Fragment>
      <Box component="li" sx={{ mb: 1, ml: index * 2, pr: 5 }}>
        <Box
          sx={{
            "& a": {
              color: "text.secondary",
              textTransform: "capitalize",
              transition: "0.3s ease",
              "&:hover": { color: "secondary.main" },
            },
          }}
        >
          <Link to={"/"} onClick={(e) => handleChooseCategory(e, subCategory)}>
            {subCategory.name}
          </Link>
        </Box>
      </Box>
      {subCategory.children &&
        subCategory.children.length > 0 &&
        subCategory.children.map((child) => (
          <SubCategoryList key={child.id} subCategory={child} index={index + 1} />
        ))}
    </Fragment>
  );
}

export const HeaderCategoryList = () => {
  const { categoryData } = useSelector((state: RootState) => state.navbar);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (categoryData?.length === 0) {
      dispatch(
        fetchSidebar({
          url: "/category/getTree",
          method: "get",
        })
      );
    }
  }, []);

  return (
    <Box
      id="header-category"
      sx={{
        position: "absolute",
        top: "45px",
        left: 0,
        zIndex: 150,
        mx: "auto",
        display: "flex",
        justifyContent: "center",
        width: "100%",
        opacity: 0,
        visibility: "hidden",
        transform: "translateY(20px)",
        transition: "all 0.3s ease",
        "&.active": {
          opacity: 1,
          visibility: "visible",
          transform: "translateY(0)",
        },
      }}
    >
      <Box
        className="menu-wrapper"
        sx={{
          maxWidth: "100%",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
          p: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            "& ul li:first-of-type": {
              borderBottom: "1px solid #fff",
              minWidth: "100px",
            },
          }}
        >
          {categoryData?.map((category) => (
            <Box key={category.id} component="ul">
              <SubCategoryList subCategory={category} index={0} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
