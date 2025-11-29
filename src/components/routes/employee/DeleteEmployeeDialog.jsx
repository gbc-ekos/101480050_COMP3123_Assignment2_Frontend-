import {deleteEmployee} from "../../../redux/slices/employeeSlice";
import {useDispatch} from "react-redux";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from "@mui/material";

export default function DeleteEmployeeDialog({
    open,
    employeeId,
    employeeName,
    onCancel,
    loading = false,
}) {
    const dispatch = useDispatch();


    const handleDeleteConfirm = async (employeeId) => {
        const result = await dispatch(deleteEmployee({employeeId}));
        if (deleteEmployee.fulfilled.match(result)) {
            onCancel(true)
        }
    }

    return (
        <Dialog
            open={open}
            onClose={onCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Delete Employee</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete <strong>{employeeName}</strong>? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    onClick={() => handleDeleteConfirm(employeeId)}
                    color="error"
                    variant="contained"
                    disabled={loading}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}