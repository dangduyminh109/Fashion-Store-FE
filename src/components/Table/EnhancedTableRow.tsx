import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import Switch from "@mui/material/Switch";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Typography from "@mui/material/Typography";

import ActionGroup from "./ActionGroup";
import type { HeadCell, RowData } from "./interface";

interface EnhancedTableRowProps<Data extends RowData> {
  isItemSelected: boolean;
  headCells: HeadCell<Data>[];
  rowData: Data;
  editAction: boolean;
  deleteAction: boolean;
  restoreAction: boolean;
  labelId: string;
  rowOpen: number;
  index: number;
  isParentRow: boolean;
  handleClick: (id: number) => void;
  setRowOpen: React.Dispatch<React.SetStateAction<number>>;
}

export default function EnhancedTableRow<Data extends RowData>(props: EnhancedTableRowProps<Data>) {
  const {
    isItemSelected,
    headCells,
    rowData,
    editAction,
    deleteAction,
    restoreAction,
    rowOpen,
    labelId,
    index,
    isParentRow,
    handleClick,
    setRowOpen,
  } = props;

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
            onClick={() => handleClick(rowData.id)}
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
          {typeof rowData[head.id] === "boolean" ? (
            <Switch
              checked={rowData[head.id]}
              slotProps={{ input: { "aria-label": "controlled" } }}
              color="success"
            />
          ) : idx === 0 && rowData.children != null ? (
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
                  {rowData[head.id] || "-"}
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
              {rowData[head.id] || "-"}
            </Typography>
          )}
        </TableCell>
      ))}
      <ActionGroup
        editAction={editAction}
        restoreAction={restoreAction}
        deleteAction={deleteAction}
      />
    </TableRow>
  );
}
