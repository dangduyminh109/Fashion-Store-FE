import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { Fragment, useContext, useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

import Breadcrumb from "~/admin/components/Breadcrumb";
import axiosClient from "~/admin/hooks/useFetch";
import type Permission from "~/admin/types/permission";
import schema from "~/admin/schemas/permissionSchema";
import getLastError from "~/utils/onErrorValidate";
import { BackDropContext } from "~/admin/context/BackDrop";

const listBreadcrumb = [
  {
    title: "User",
    url: "/admin/users",
  },
  {
    title: "Phân Quyền",
    url: "/admin/user/Permissions",
  },
];

interface PermissionGroup {
  label: string;
  listPermission: Permission[];
}

const Role = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [permissionGroup, setPermissionGroup] = useState<PermissionGroup[]>([]);
  const [listPermissionId, setListPermissionId] = useState<number[]>([]);
  const { setBackDrop } = useContext(BackDropContext);

  const { control, handleSubmit, setValue, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      updates: [],
    },
  });
  const { fields: ListRole } = useFieldArray({
    control,
    name: "updates",
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [role, permission] = await Promise.all([
          axiosClient.get("/role?status=true"),
          axiosClient.get("/role/permission"),
        ]);

        if (permission.data.code == 1000) {
          const permissionData: Permission[] = permission.data.result;
          setListPermissionId(permissionData.map((item) => item.id));
          const p = permissionData.reduce((list: PermissionGroup[], item) => {
            const permissionItem = list.find((p) => p.label === item.module);
            if (permissionItem) {
              permissionItem.listPermission.push(item);
            } else {
              list.push({
                label: item.module,
                listPermission: [item],
              });
            }
            return list;
          }, []);
          setPermissionGroup(p);
        } else if (permission.data.code != 9401 || permission.data.code != 9400) {
          toast(permission.data.result.message);
          setError(permission.data.result.message);
        }

        if (role.data.code == 1000) {
          reset({
            updates: role.data.result.map((role: any) => ({
              id: role.id,
              name: role.name,
              permissionIds: role.permissions.map((p: any) => p.id),
            })),
          });
        } else if (role.data.code != 9401 || role.data.code != 9400) {
          toast(role.data.result.message);
          setError(role.data.result.message);
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

  const onSubmit = async (data: any) => {
    setBackDrop(true);
    try {
      const res = await axiosClient.put("/role/permission", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.data.code == 1000) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Cập nhật thành công! Có lỗi xãy ra!");
      }
    } finally {
      setBackDrop(false);
    }
  };

  const onError = (data: any) => {
    console.log(data);
    toast.warning(getLastError(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)}>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Phân Quyền" />
      {loading && (
        <Box
          sx={{
            with: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress sx={{ color: "text.secondary" }} />
        </Box>
      )}
      {!loading && error && <Box margin={"0 auto"}>{error}</Box>}
      {!loading && (
        <Box>
          <Box sx={{ display: "flex", justifyContent: "end", gap: "10px", mb: "10px" }}>
            <Button size="large" onClick={() => reset()}>
              Đặt Lại
            </Button>
            <Button type="submit" size="large">
              Cập Nhập
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table
              sx={{
                minWidth: 650,
              }}
              aria-label="simple table"
            >
              <TableHead>
                <TableRow>
                  <TableCell component="th" scope="row"></TableCell>
                  {ListRole.map((item) => (
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ textTransform: "capitalize" }}
                      key={item.id}
                    >
                      {item.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="td" scope="row"></TableCell>
                  {ListRole.map((item, idx) => (
                    <TableCell component="td" scope="row" key={item.id}>
                      <Controller
                        name={`updates.${idx}.permissionIds`}
                        control={control}
                        render={({ field }) => {
                          const checked = field.value.length === listPermissionId.length;
                          return (
                            <Checkbox
                              checked={checked}
                              onChange={() =>
                                setValue(
                                  `updates.${idx}.permissionIds`,
                                  checked ? [] : listPermissionId
                                )
                              }
                              size="large"
                              slotProps={{
                                input: { "aria-label": "select all desserts" },
                              }}
                              sx={{
                                "& svg": {
                                  color: "text.secondary",
                                },
                                "&.Mui-checked svg": {
                                  color: "text.secondary",
                                },
                              }}
                            />
                          );
                        }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
                {permissionGroup &&
                  permissionGroup.map((permissionItem) => {
                    return (
                      <Fragment key={permissionItem.label}>
                        <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                          <TableCell component="td" scope="row" sx={{ bgcolor: "secondary.dark" }}>
                            {permissionItem.label}
                          </TableCell>
                          {ListRole.map((item) => (
                            <TableCell
                              key={item.id}
                              component="td"
                              scope="row"
                              sx={{ bgcolor: "secondary.dark" }}
                            ></TableCell>
                          ))}
                        </TableRow>
                        {permissionItem.listPermission.map((permission) => {
                          return (
                            <TableRow
                              key={permission.id}
                              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                            >
                              <TableCell component="td" scope="row">
                                {permission.name}
                              </TableCell>
                              {ListRole.map((item, idx) => (
                                <TableCell component="td" scope="row" key={item.id}>
                                  <Controller
                                    name={`updates.${idx}.permissionIds`}
                                    control={control}
                                    render={({ field }) => {
                                      const checked = field.value.includes(permission.id);
                                      return (
                                        <Checkbox
                                          checked={checked}
                                          onChange={() =>
                                            setValue(
                                              `updates.${idx}.permissionIds`,
                                              checked
                                                ? field.value.filter(
                                                    (item) => item != permission.id
                                                  )
                                                : [...field.value, permission.id]
                                            )
                                          }
                                          size="large"
                                          slotProps={{
                                            input: { "aria-label": "select all desserts" },
                                          }}
                                          sx={{
                                            "& svg": {
                                              color: "text.secondary",
                                            },
                                            "&.Mui-checked svg": {
                                              color: "text.secondary",
                                            },
                                          }}
                                        />
                                      );
                                    }}
                                  />
                                </TableCell>
                              ))}
                            </TableRow>
                          );
                        })}
                      </Fragment>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </form>
  );
};

export default Role;
