import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import Switch from "@mui/material/Switch";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";

import ActionGroup from "./ActionGroup";
import type { HeadCell, RowData } from "./interface";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "~/store";
import { updateStatus } from "~/features/product/productApi";

interface EnhancedTableRowProps<Data extends RowData> {
  isItemSelected: boolean;
  headCells: HeadCell<Data>[];
  rowData: Data;
  labelId: string;
  rowOpen: number;
  index: number;
  isParentRow: boolean;
  path: string;
  childPath: string;
  handleClick: (id: number) => void;
  setRowOpen: React.Dispatch<React.SetStateAction<number>>;
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
  } = props;
  const row = rowData;
  const dispatch = useDispatch<AppDispatch>();
  
  async function handleSwitch({ path, field, id }: { path: string; field: string; id: string }) {
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
      {headCells.map((head, idx) => (
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
          ) : idx === 0 && row.children != null ? (
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
                  {row[head.id] || "-"}
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
              {row[head.id] || "-"}
            </Typography>
          )}
        </TableCell>
      ))}
      {isParentRow ? <ActionGroup path={path} id={row.id} /> : <TableCell></TableCell>}
    </TableRow>
  );
}
