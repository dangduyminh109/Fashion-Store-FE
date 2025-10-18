import { useEffect, useState } from "react";
import axios from "axios";
const API_PATH = import.meta.env.VITE_API_PATH;
const axiosClient = axios.create({
  baseURL: `${API_PATH}`,
});

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
        const res = await axiosClient.request({
          url: endpoint,
          method,
          signal: controller.signal,
          ...options,
        });
        if (!mounted) return;
        setData(res.data.result);
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
