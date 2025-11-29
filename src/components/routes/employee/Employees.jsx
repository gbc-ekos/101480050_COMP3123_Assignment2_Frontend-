import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {Fragment} from "react";
import {clearError, listEmployees} from "../../../redux/slices/employeeSlice";
import {
    Alert,
    Box,
    Button,
    ButtonGroup,
    CircularProgress,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import DeleteEmployeeDialog from "./DeleteEmployeeDialog";

export default function Employees() {
    const dispatch = useDispatch();
    const {loading, error, employees} = useSelector((state) => state.employees);
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        employeeId: null,
        employeeName: null,
    });

    // Fetch employees on component mount
    useEffect(() => {
        dispatch(listEmployees());
    }, [dispatch]);

    const handleRetry = () => {
        dispatch(listEmployees());
    };

    const handleClearError = () => {
        dispatch(clearError());
    };

    const handleDeleteClick = (id, name) => {
        setDeleteDialog({
            open: true,
            employeeId: id,
            employeeName: name,
        });
    };

    const handleDeleteCancel = () => {
        setDeleteDialog({ open: false, employeeId: null, employeeName: null });
    };

    if (loading) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px'}}>
                <CircularProgress/>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{mt: 2}}>
                <Alert severity="error" onClose={handleClearError}>
                    {error}
                </Alert>
                <Button variant="contained" sx={{mt: 2}} onClick={handleRetry}>
                    Retry
                </Button>
            </Box>
        );
    }

    return (
        <Fragment>
            <TableContainer component={Paper}>
                <Table sx={{minWidth: 650}} aria-label="employees table">
                    <TableHead>
                        <TableRow sx={{backgroundColor: '#f5f5f5'}}>
                            <TableCell><strong>ID</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Department</strong></TableCell>
                            <TableCell align={"center"}><strong>Action</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {employees && employees.length > 0 ? (
                            employees.map((employee) => (
                                <TableRow key={employee.employee_id} hover>
                                    <TableCell>{employee.employee_id}</TableCell>
                                    <TableCell>{employee.email || '-'}</TableCell>
                                    <TableCell>{employee.department || '-'}</TableCell>
                                    <TableCell align={"center"}>
                                        <ButtonGroup variant="outlined" aria-label="Actions">
                                            <Button>Browse</Button>
                                            <Button
                                                color="error"
                                                onClick={() => handleDeleteClick(employee.employee_id, employee.email)}
                                            >
                                                Delete
                                            </Button>
                                        </ButtonGroup>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No employees found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <DeleteEmployeeDialog
                open={deleteDialog.open}
                employeeId={deleteDialog.employeeId}
                employeeName={deleteDialog.employeeName}
                onCancel={handleDeleteCancel}
            />
        </Fragment>
    );
}