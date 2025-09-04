import { useEffect, useState } from "react";
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8081/fashion-store/api/admin",
});

// Gắn token cho mỗi request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// kiểm tra nếu 401 thì gọi refresh token
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // kiểm tra đã thử refresh trước đó chưa
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem("token")
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          "http://localhost:8081/fashion-store/api/admin" + "/auth/refresh",
          {
            token: localStorage.getItem("token"),
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (res.data.code === 1000) {
          const newToken = res.data.result.token;
          localStorage.setItem("token", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          axiosClient(originalRequest);
        }
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: any;
}

export function useFetch<T>({
  endpoint,
  method,
  options = {},
}: {
  endpoint: string;
  method: "get" | "post" | "put" | "patch" | "delete";
  options?: import("axios").AxiosRequestConfig;
  enabled?: boolean;
}): FetchState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (!endpoint) return;
    let mounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        if (mounted) setLoading(true);
        const result = await axiosClient.request({
          url: endpoint,
          method,
          signal: controller.signal,
          ...options,
        });
        if (!mounted) return;
        setData(result.data);
        setError(null);
      } catch (err: any) {
        if (axios.isCancel(err) || err.code === "ERR_CANCELED") {
          return;
        }
        if (!mounted) return;
        setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [endpoint, method, JSON.stringify(options)]);

  return { data, loading, error };
}
