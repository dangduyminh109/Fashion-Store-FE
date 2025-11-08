import { Fragment } from "react/jsx-runtime";
import { useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import ProductDetail from "./components/ProductDetail";
import axiosClient from "~/client/hooks/useFetch";

import type ProductFeatured from "~/client/types/productFeatured";
import { SuggestProduct } from "./components/SuggestProduct";
import { ProductDescription } from "./components/ProductDescription";
import BreadcrumbContext from "~/client/context/BreadcrumbContext";
function Detail() {
  const [product, setProduct] = useState<ProductFeatured | null>(null);
  const { slug } = useParams();
  const { setBreadcrumb } = useContext(BreadcrumbContext);

  useEffect(() => {
    const listBreadcrumb = [
      {
        title: "Trang Chủ",
        url: "/",
      },
      {
        title: product?.name || "",
        url: `/${slug}`,
      },
    ];
    setBreadcrumb(listBreadcrumb);
  }, [product, slug]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const product = await axiosClient.get("/product/slug/" + slug);
        if (product.data.code == 1000) {
          setProduct(product.data.result);
        } else if (product.data.code != 9401 || product.data.code != 9400) {
          toast(product.data.result.message);
        }
      } catch (error: any) {
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Tải dử liệu không thành công! Có lỗi xãy ra!");
        }
      }
    };
    fetchData();
  }, [slug]);

  return (
    <Fragment>
      <ProductDetail data={product} />
      <ProductDescription description={product?.description} />
      {product && <SuggestProduct productId={product?.id} />}
    </Fragment>
  );
}

export default Detail;
