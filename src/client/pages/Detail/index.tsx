import { Fragment } from "react/jsx-runtime";
import { useParams } from "react-router-dom";

import Breadcrumb from "~/client/components/Breadcrumb";
import ProductDetail from "./components/ProductDetail";
import axiosClient from "~/client/hooks/useFetch";
import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import type ProductFeatured from "~/client/types/productFeatured";

function Detail() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [product, setProduct] = useState<ProductFeatured | null>(null);

  const { slug } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const product = await axiosClient.get("/product/slug/" + slug);
        if (product.data.code == 1000) {
          setProduct(product.data.result);
        } else if (product.data.code != 9401 || product.data.code != 9400) {
          toast(product.data.result.message);
        }
      } catch (error: any) {
        if (error.response?.data?.code == 9401 || error.response?.data?.code == 9400) {
          setError(error.response.data.message);
        }
        if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Tải dử liệu không thành công! Có lỗi xãy ra!");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  return (
    <Fragment>
      <Breadcrumb listBreadcrumb={listBreadcrumb} />
      <ProductDetail data={product} />
    </Fragment>
  );
}

export default Detail;
