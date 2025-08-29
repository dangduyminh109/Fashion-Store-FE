import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import type { HeadCell, RowData, Order } from "./interface";
import EnhancedTableRow from "./EnhancedTableRow";
import EnhancedTableHead from "./EnhancedTableHead";

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key | null
): (a: { [k in Key]: number | string }, b: { [k in Key]: number | string }) => number {
  if (!orderBy || order == "default") return () => 0;
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface EnhancedTableProps<Data extends RowData> {
  headCells: HeadCell<Data>[];
  rowData: Data[];
  editAction: boolean;
  deleteAction: boolean;
  restoreAction: boolean;
}

function EnhancedTable<Data extends RowData>(props: EnhancedTableProps<Data>) {
  const { headCells, rowData, editAction, deleteAction, restoreAction } = props;
  const [order, setOrder] = useState<Order>("default");
  const [orderBy, setOrderBy] = useState<keyof Data | null>(null);
  const [selected, setSelected] = useState<readonly number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rowOpen, setRowOpen] = useState(-1);

  const handleRequestSort = (property: keyof Data | null) => {
    setOrderBy(property);
    order === "default"
      ? setOrder("asc")
      : order === "asc"
      ? setOrder("desc")
      : setOrder("default");
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rowData.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowData.length) : 0;

  const visibleRows = React.useMemo(() => {
    if (orderBy != null) {
      return [...rowData]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    } else {
      return [...rowData].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }
  }, [order, orderBy, page, rowsPerPage]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer sx={{ width: "100%", overflow: "auto" }}>
          <Table sx={{ minWidth: 1200 }}>
            <EnhancedTableHead
              headCells={headCells}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rowData.length}
              rowData={rowData}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = selected.includes(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <React.Fragment key={row.id}>
                    <EnhancedTableRow
                      labelId={labelId}
                      isItemSelected={isItemSelected}
                      rowData={row}
                      handleClick={handleClick}
                      setRowOpen={setRowOpen}
                      editAction={editAction}
                      deleteAction={deleteAction}
                      restoreAction={restoreAction}
                      rowOpen={rowOpen}
                      index={index}
                      headCells={headCells}
                      isParentRow={true}
                    />
                    {row.children != null &&
                      row.children.map((childRow: Data) => {
                        return (
                          <EnhancedTableRow
                            labelId={labelId}
                            isItemSelected={isItemSelected}
                            rowData={childRow}
                            handleClick={handleClick}
                            setRowOpen={setRowOpen}
                            editAction={editAction}
                            deleteAction={deleteAction}
                            restoreAction={restoreAction}
                            rowOpen={rowOpen}
                            index={index}
                            headCells={headCells}
                            isParentRow={false}
                            key={childRow.id}
                          />
                        );
                      })}
                  </React.Fragment>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rowData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

export default EnhancedTable;
