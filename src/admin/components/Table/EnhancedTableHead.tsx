import * as React from "react";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import IconButton from "@mui/material/IconButton";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import type { HeadCell, RowData, Order } from "./interface";

interface EnhancedTableHeadProps<Data extends RowData> {
  headCells: HeadCell<Data>[];
  numSelected: number;
  onRequestSort: (property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: keyof Data | null;
  rowData: Data[];
  rowCount: number;
}

export default function EnhancedTableHead<Data extends RowData>(
  props: EnhancedTableHeadProps<Data>
) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells } =
    props;
  const createSortHandler = (property: keyof Data) => () => {
    onRequestSort(property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox" sx={{ whileSpace: "nowrap" }}>
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            size="large"
            slotProps={{ input: { "aria-label": "select all desserts" } }}
            sx={{
              "& svg": {
                color: "text.secondary",
              },
              "&.Mui-checked svg": {
                color: "text.secondary",
              },
            }}
          />
        </TableCell>
        {headCells.map((headCell) => {
          const sortDirection =
            orderBy === headCell.id ? (order === "default" ? false : order) : false;
          if (headCell.hasSort) {
            return (
              <TableCell
                key={String(headCell.id)}
                sortDirection={sortDirection}
                sx={{ whiteSpace: "nowrap" }}
              >
                {headCell.label}
                <IconButton
                  color="secondary"
                  aria-label="add an alarm"
                  onClick={createSortHandler(headCell.id)}
                  sx={{ ":hover svg": { color: "text.secondary" } }}
                >
                  {sortDirection === false ? (
                    <ImportExportIcon sx={{ color: "text.secondary" }} />
                  ) : sortDirection === "asc" ? (
                    <ArrowUpwardIcon sx={{ color: "text.secondary" }} />
                  ) : (
                    <ArrowDownwardIcon sx={{ color: "text.secondary" }} />
                  )}
                </IconButton>
              </TableCell>
            );
          } else {
            return (
              <TableCell key={String(headCell.id)} sx={{ whiteSpace: "nowrap" }}>
                {headCell.label}
              </TableCell>
            );
          }
        })}
        <TableCell></TableCell>
      </TableRow>
    </TableHead>
  );
}
