import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {Alert, Box, Button, CircularProgress, Container, Stack, TextField, Typography,} from "@mui/material";
import {clearError, createEmployee, getEmployeeById, updateEmployee} from "../../../redux/slices/employeeSlice";
import DeleteEmployeeDialog from "./DeleteEmployeeDialog";

export default function EmployeeForm() {
    const {id: employeeId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {loading, error, selectedEmployee} = useSelector((state) => state.employees);
    const isEditMode = !!employeeId;

    // Form state
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        position: "",
        salary: "",
        date_of_joining: "",
        department: "",
    });

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    // Extract field errors and general message
    const fieldErrors = typeof error === 'object' && error?.fieldErrors ? error.fieldErrors : {};
    const errorMessage = typeof error === 'object' && error?.message ? error.message : error;

    // Load employee data when in edit mode
    useEffect(() => {
        if (isEditMode) {
            dispatch(getEmployeeById({employeeId}));
        }
    }, [isEditMode, employeeId, dispatch]);

    // Populate form when employee data is loaded
    useEffect(() => {
        if (isEditMode && selectedEmployee) {
            setFormData({
                first_name: selectedEmployee.first_name || "",
                last_name: selectedEmployee.last_name || "",
                email: selectedEmployee.email || "",
                position: selectedEmployee.position || "",
                salary: selectedEmployee.salary || "",
                date_of_joining: selectedEmployee.date_of_joining ? selectedEmployee.date_of_joining.split('T')[0] : "",
                department: selectedEmployee.department || "",
            });
        }
    }, [isEditMode, selectedEmployee]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.first_name || !formData.last_name || !formData.email || !formData.position || !formData.salary || !formData.department) {
            return;
        }

        try {
            let result;
            if (isEditMode) {
                result = await dispatch(updateEmployee({employeeId, formData}));
            } else {
                result = await dispatch(createEmployee(formData));
            }

            // Check if the operation was successful
            if (isEditMode ? updateEmployee.fulfilled.match(result) : createEmployee.fulfilled.match(result)) {
                navigate("/employee");
            }
        } catch (err) {
            console.error('Error saving employee:', err);
        }
    };

    const handleClearError = () => {
        dispatch(clearError());
    };

    const handleCancel = () => {
        navigate("/employee");
    };

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
    };

    const handleDeleteCancel = (wasDeleted) => {
        setDeleteDialogOpen(false);
        if (wasDeleted) {
            navigate("/employee");
        }
    };

    if (loading && isEditMode) {
        return (
            <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px'}}>
                <CircularProgress/>
            </Box>
        );
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{mt: 4, mb: 4}}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {isEditMode ? 'Edit Employee' : 'Create Employee'}
                </Typography>
                <Typography color="textSecondary" mb={3}>
                    {isEditMode ? 'Update employee information' : 'Add a new employee to the system'}
                </Typography>

                {errorMessage && (
                    <Alert severity="error" onClose={handleClearError} sx={{mb: 2}}>
                        {errorMessage}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack gap={2}>
                        <TextField
                            label="First Name"
                            name="first_name"
                            variant="outlined"
                            fullWidth
                            value={formData.first_name}
                            onChange={handleChange}
                            disabled={loading}
                            required
                            error={!!fieldErrors.first_name}
                            helperText={fieldErrors.first_name}
                        />
                        <TextField
                            label="Last Name"
                            name="last_name"
                            variant="outlined"
                            fullWidth
                            value={formData.last_name}
                            onChange={handleChange}
                            disabled={loading}
                            required
                            error={!!fieldErrors.last_name}
                            helperText={fieldErrors.last_name}
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                            required
                            error={!!fieldErrors.email}
                            helperText={fieldErrors.email}
                        />
                        <TextField
                            label="Position"
                            name="position"
                            variant="outlined"
                            fullWidth
                            value={formData.position}
                            onChange={handleChange}
                            disabled={loading}
                            required
                            error={!!fieldErrors.position}
                            helperText={fieldErrors.position}
                        />
                        <TextField
                            label="Salary"
                            name="salary"
                            type="number"
                            variant="outlined"
                            fullWidth
                            value={formData.salary}
                            onChange={handleChange}
                            disabled={loading}
                            required
                            inputProps={{step: "0.01"}}
                            error={!!fieldErrors.salary}
                            helperText={fieldErrors.salary}
                        />
                        <TextField
                            label="Date of Joining"
                            name="date_of_joining"
                            type="date"
                            variant="outlined"
                            fullWidth
                            value={formData.date_of_joining}
                            onChange={handleChange}
                            disabled={loading}
                            InputLabelProps={{shrink: true}}
                            error={!!fieldErrors.date_of_joining}
                            helperText={fieldErrors.date_of_joining}
                        />
                        <TextField
                            label="Department"
                            name="department"
                            variant="outlined"
                            fullWidth
                            value={formData.department}
                            onChange={handleChange}
                            disabled={loading}
                            required
                            error={!!fieldErrors.department}
                            helperText={fieldErrors.department}
                        />

                        <Box display="flex" gap={1} sx={{mt: 1}}>
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24}/> : (isEditMode ? 'Update' : 'Create')}
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            {isEditMode && (
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleDeleteClick}
                                    disabled={loading}
                                >
                                    Delete
                                </Button>
                            )}
                        </Box>
                    </Stack>
                </Box>

                {isEditMode && selectedEmployee && (
                    <DeleteEmployeeDialog
                        open={deleteDialogOpen}
                        employeeId={selectedEmployee.employee_id}
                        employeeName={selectedEmployee.email}
                        onCancel={handleDeleteCancel}
                    />
                )}
            </Box>
        </Container>
    );
}
