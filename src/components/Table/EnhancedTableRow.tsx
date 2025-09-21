import { useDispatch } from "react-redux";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import Switch from "@mui/material/Switch";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";
import type { AsyncThunk } from "@reduxjs/toolkit";

import ActionGroup from "./ActionGroup";
import type { HeadCell, RowData } from "./interface";
import type { AppDispatch } from "~/store";
import type { Params } from "~/utils/createApiThunk";
import type Response from "~/types/response";
import defaultImage from "~/assets/images/default-image.png";

interface EnhancedTableRowProps<Data extends RowData> {
  isItemSelected: boolean;
  headCells: HeadCell<Data>[];
  rowData: Data;
  labelId: string;
  rowOpen: number;
  index: number;
  isParentRow: boolean;
  path: string;
  childPath?: string;
  trash: boolean;
  editAction: boolean;
  restoreAction: boolean;
  deleteAction: boolean;
  entity: string;
  handleClick: (id: number) => void;
  setRowOpen: React.Dispatch<React.SetStateAction<number>>;
  deleteOrRestore: AsyncThunk<Response, Params, { rejectValue: Response }>;
  updateStatus?: AsyncThunk<Response, Params, { rejectValue: Response }>;
}

export default function EnhancedTableRow<Data extends RowData>(props: EnhancedTableRowProps<Data>) {
  const {
    isItemSelected,
    headCells,
    rowData,
    rowOpen,
    labelId,
    index,
    isParentRow,
    handleClick,
    setRowOpen,
    path,
    childPath,
    restoreAction,
    deleteAction,
    editAction,
    trash,
    entity,
    deleteOrRestore,
    updateStatus,
  } = props;
  const row = rowData;
  const dispatch = useDispatch<AppDispatch>();

  async function handleSwitch({ path, field, id }: { path: string; field: string; id: string }) {
    if (updateStatus) {
      let fieldRequest = field;
      if (fieldRequest === "isFeatured") fieldRequest = "featured";
      let url = `${path}/${String(id)}/${fieldRequest}`;
      if (!isParentRow && childPath) url = `${path}/${childPath}/${String(id)}/${fieldRequest}`;
      try {
        const result = await dispatch(updateStatus({ url, method: "patch" })).unwrap();
        toast.success(result.message);
      } catch (err: any) {
        toast.error(err.message ?? "Có lỗi xảy ra!");
      }
    }
  }
  return (
    <TableRow
      role="checkbox"
      tabIndex={-1}
      selected={isItemSelected}
      sx={{
        display: rowOpen === index || isParentRow ? "table-row" : "none",
      }}
    >
      <TableCell padding="checkbox">
        {isParentRow && (
          <Checkbox
            onClick={() => handleClick(row.id)}
            checked={isItemSelected}
            aria-label={labelId}
            size="large"
            sx={{
              "& svg": {
                color: "text.secondary",
              },
              "&.Mui-checked svg": {
                color: "text.secondary",
              },
            }}
          />
        )}
      </TableCell>

      {headCells.map((head, idx) => {
        if ((head.id === "image" || head.id === "avatar") && isParentRow) {
          return (
            <TableCell padding="checkbox" key={String(head.id)}>
              <Box
                sx={{
                  maxHeight: "50px",
                  maxWidth: "50px",
                  overflow: "hidden",
                  margin: "0 auto",
                  "& img": { objectFit: "cover", width: "100%" },
                }}
              >
                <img src={row["image"] || row["avatar"] || defaultImage} alt="" />
              </Box>
            </TableCell>
          );
        } else {
          return (
            <TableCell
              key={String(head.id)}
              align="left"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "200px",
                whiteSpace: "nowrap",
              }}
            >
              {typeof row[head.id] === "boolean" ? (
                <Switch
                  checked={row[head.id]}
                  slotProps={{ input: { "aria-label": "controlled" } }}
                  color="success"
                  onClick={() => handleSwitch({ path, field: String(head.id), id: row.id })}
                />
              ) : idx === (head.id === "image" || head.id === "avatar" ? 0 : 1) &&
                row.children != null ? (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <ArrowForwardIosIcon
                      onClick={() => setRowOpen(rowOpen === index ? -1 : index)}
                      fontSize="small"
                      sx={{
                        transform: rowOpen === index ? "rotate(90deg)" : "rotate(0)",
                        cursor: "pointer",
                        color: "text.secondary",
                      }}
                    />
                    <Typography
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "150px",
                        whiteSpace: "nowrap",
                      }}
                      variant="body1"
                    >
                      {head.isMoney
                        ? Number(row[head.id]).toLocaleString("vi-VN") + "đ" || "-"
                        : row[head.id] || "-"}
                    </Typography>
                  </Box>
                </>
              ) : (
                <Typography
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "150px",
                    whiteSpace: "nowrap",
                  }}
                  variant="body1"
                >
                  {head.isMoney
                    ? Number(row[head.id]).toLocaleString("vi-VN") + "đ" || "-"
                    : row[head.id] || "-"}
                </Typography>
              )}
            </TableCell>
          );
        }
      })}
      {isParentRow ? (
        <ActionGroup
          path={path}
          id={row.id}
          restoreAction={restoreAction}
          deleteAction={deleteAction}
          editAction={editAction}
          trash={trash}
          entity={entity}
          deleteOrRestore={deleteOrRestore}
        />
      ) : (
        <TableCell></TableCell>
      )}
    </TableRow>
  );
}
