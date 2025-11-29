import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {Fragment} from "react";
import {useNavigate} from "react-router-dom";
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
    TextField,
} from "@mui/material";
import DeleteEmployeeDialog from "./DeleteEmployeeDialog";

export default function Employees() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {loading, error, employees} = useSelector((state) => state.employees);
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        employeeId: null,
        employeeName: null,
    });
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch employees on component mount
    useEffect(() => {
        dispatch(listEmployees());
    }, [dispatch]);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
    };

    // Trigger search when query changes with debouncing
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(listEmployees(searchQuery || undefined));
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, dispatch]);

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

    return (
        <Fragment>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, gap: 2 }}>
                <TextField
                    placeholder="Search employees..."
                    size="small"
                    variant="outlined"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{ flex: 1, maxWidth: 300 }}
                />
                <Button
                    variant="contained"
                    onClick={() => navigate('/employee/new')}
                >
                    Create Employee
                </Button>
            </Box>

            {error ? (
                <Box sx={{mt: 2}}>
                    <Alert severity="error" onClose={handleClearError}>
                        {error}
                    </Alert>
                    <Button variant="contained" sx={{mt: 2}} onClick={handleRetry}>
                        Retry
                    </Button>
                </Box>
            ) : (
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
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{py: 4}}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : employees && employees.length > 0 ? (
                                employees.map((employee) => (
                                    <TableRow key={employee.employee_id} hover>
                                        <TableCell>{employee.employee_id}</TableCell>
                                        <TableCell>{employee.email || '-'}</TableCell>
                                        <TableCell>{employee.department || '-'}</TableCell>
                                        <TableCell align={"center"}>
                                            <ButtonGroup variant="outlined" aria-label="Actions" size="small">
                                                <Button
                                                    onClick={() => navigate(`/employee/${employee.employee_id}`)}
                                                >
                                                    Edit
                                                </Button>
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
                                    <TableCell colSpan={4} align="center">
                                        No employees found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <DeleteEmployeeDialog
                open={deleteDialog.open}
                employeeId={deleteDialog.employeeId}
                employeeName={deleteDialog.employeeName}
                onCancel={handleDeleteCancel}
            />
        </Fragment>
    );
}