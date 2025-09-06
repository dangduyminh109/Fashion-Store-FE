import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import type { AsyncThunk } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import { toast } from "react-toastify";

import ConfirmModel from "../ConfirmModel";
import type { AppDispatch } from "~/store";
import type { Params } from "~/utils/createApiThunk";
import type Response from "~/types/response";

type Props = {
  path: string;
  trash: boolean;
  editAction: boolean;
  restoreAction: boolean;
  deleteAction: boolean;
  entity: string;
  id?: string;
  deleteOrRestore: AsyncThunk<Response, Params, { rejectValue: Response }>;
};
export default function ActionGroup(props: Props) {
  const { trash, editAction, deleteAction, restoreAction, entity, deleteOrRestore } = props;
  const [content, setContent] = useState<ReactNode>();
  const [title, setTitle] = useState<string>("");
  const [action, setAction] = useState<string>("");
  const [method, setMethod] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { path, id } = props;

  async function handleAction({ action, method }: { action: string; method: string }) {
    setOpen(false);
    let url = `${path}/${String(id)}/${action}`;
    if (action === "delete") url = `${path}/${String(id)}`;
    try {
      const result = await dispatch(deleteOrRestore({ url, method })).unwrap();
      toast.success(result.message);
    } catch (err: any) {
      toast.error(err.message ?? "Có lỗi xảy ra!");
    }
  }

  function handleDeleteOrRestore(message: ReactNode, action: string, method: string) {
    setOpen(true);
    setAction(action);
    setMethod(method);
    setTitle(entity);
    setContent(message);
  }

  function handleEdit() {
    navigate(`${path}/edit/${String(id)}`);
  }
  return (
    <TableCell
      sx={{
        whiteSpace: "nowrap",
      }}
    >
      {restoreAction && trash && (
        <IconButton
          aria-label="restore"
          onClick={() =>
            handleDeleteOrRestore(
              `Bạn có chắc muốn không phục ${entity} này không`,
              "restore",
              "patch"
            )
          }
        >
          <SettingsBackupRestoreIcon sx={{ color: "success.main" }} />
        </IconButton>
      )}

      {editAction && !trash && (
        <IconButton aria-label="edit" onClick={handleEdit}>
          <EditSquareIcon sx={{ color: "success.main" }} />
        </IconButton>
      )}

      {deleteAction && (
        <IconButton
          aria-label={trash ? "destroy" : "delete"}
          onClick={() =>
            handleDeleteOrRestore(
              <Typography variant="body1">
                Bạn có chắc muốn{" "}
                <Box component={"strong"} sx={{ color: "text.secondary" }}>
                  {trash ? "xóa vĩnh viễn " : " xóa "}
                  {entity}
                </Box>{" "}
                này không. {trash && "Hành động này không thể hoàn tác!!!"}
              </Typography>,
              trash ? "destroy" : "delete",
              "delete"
            )
          }
        >
          <DeleteIcon sx={{ color: "error.main" }} />
        </IconButton>
      )}
      <ConfirmModel
        title={title}
        content={content}
        open={open}
        setOpen={setOpen}
        handleSubmit={() => handleAction({ method, action })}
      />
    </TableCell>
  );
}
