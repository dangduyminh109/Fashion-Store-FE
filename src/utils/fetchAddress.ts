import { toast } from "react-toastify";
import axiosClient from "~/client/hooks/useFetch";
import type provinces from "~/client/types/addressResponse";
import * as React from "react";

async function handleSelectProvince(
  code: number,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setDistricts: React.Dispatch<React.SetStateAction<provinces[]>>
) {
  setLoading(true);
  try {
    const districts = await axiosClient.get("/address/districts/" + code);
    if (districts.data.districts) {
      setDistricts(districts.data.districts);
    } else if (!districts.data.districts) {
      toast.error("Không thể nạp dử liệu Quận/Huyện!");
    }
  } catch (error: any) {
    toast.error("Không thể nạp dử liệu Quận/Huyện!");
  } finally {
    setLoading(false);
  }
}

async function handleSelectDistrict(
  code: number,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setWards: React.Dispatch<React.SetStateAction<provinces[]>>
) {
  setLoading(true);
  try {
    const wards = await axiosClient.get("/address/wards/" + code);
    if (wards.data.wards) {
      setWards(wards.data.wards);
    } else if (!wards.data.wards) {
      toast.error("Không thể nạp dử liệu Xã/Phường!");
    }
  } catch (error: any) {
    toast.error("Không thể nạp dử liệu Xã/Phường!");
  } finally {
    setLoading(false);
  }
}

export { handleSelectProvince, handleSelectDistrict };
