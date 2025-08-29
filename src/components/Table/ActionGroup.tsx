import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";

type Props = {
  editAction: boolean;
  deleteAction: boolean;
  restoreAction: boolean;
};
export default function ActionGroup(props: Props) {
  const { editAction, deleteAction, restoreAction } = props;
  return (
    <TableCell>
      {restoreAction && (
        <IconButton aria-label="edit">
          <SettingsBackupRestoreIcon sx={{ color: "success.main" }} />
        </IconButton>
      )}
      {editAction && (
        <IconButton aria-label="edit">
          <EditSquareIcon sx={{ color: "success.main" }} />
        </IconButton>
      )}
      {deleteAction && (
        <IconButton aria-label="delete">
          <DeleteIcon sx={{ color: "error.main" }} />
        </IconButton>
      )}
    </TableCell>
  );
}
