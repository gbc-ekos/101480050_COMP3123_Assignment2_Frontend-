import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {employeeApi} from "../../api/employeeApi";

export const listEmployees = createAsyncThunk(
    'emp/list',
    async (query, {rejectWithValue}) => {
        try {
            const response = await employeeApi.list(query);

            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Listing employees failed');
        }
    }
);

export const getEmployeeById = createAsyncThunk(
    'emp/getById',
    async ({employeeId}, {rejectWithValue}) => {
        try {
            const response = await employeeApi.getById(employeeId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to load employee');
        }
    }
);

export const createEmployee = createAsyncThunk(
    'emp/create',
    async (formData, {rejectWithValue}) => {
        try {
            const response = await employeeApi.create(formData);
            return response.data;
        } catch (error) {
            // Handle express-validator style errors
            if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
                return rejectWithValue({
                    fieldErrors: error.response.data.errors.reduce((acc, err) => {
                        acc[err.path] = err.msg;
                        return acc;
                    }, {}),
                    message: 'Validation failed',
                });
            }
            // Handle general error message
            return rejectWithValue({
                fieldErrors: {},
                message: error.response?.data?.message || 'Failed to create employee',
            });
        }
    }
);

export const updateEmployee = createAsyncThunk(
    'emp/update',
    async ({employeeId, formData}, {rejectWithValue}) => {
        try {
            const response = await employeeApi.update(employeeId, formData);
            return response.data;
        } catch (error) {
            // Handle express-validator style errors
            if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
                return rejectWithValue({
                    fieldErrors: error.response.data.errors.reduce((acc, err) => {
                        acc[err.path] = err.msg;
                        return acc;
                    }, {}),
                    message: 'Validation failed',
                });
            }
            // Handle general error message
            return rejectWithValue({
                fieldErrors: {},
                message: error.response?.data?.message || 'Failed to update employee',
            });
        }
    }
);

export const deleteEmployee = createAsyncThunk(
    'emp/delete',
    async ({employeeId}, {rejectWithValue}) => {
        try {
            await employeeApi.delete(employeeId);
            // Return employeeId even if response is 204 No Content
            return { employeeId };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Deleting employee failed');
        }
    }
);

const initialState = {
    employees: [],
    selectedEmployee: null,
    loading: false,
    error: null,
};

const employeeSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Get list cases
            .addCase(listEmployees.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(listEmployees.fulfilled, (state, action) => {
                state.loading = false;
                state.employees = action.payload;
            })
            .addCase(listEmployees.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get by ID cases
            .addCase(getEmployeeById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getEmployeeById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedEmployee = action.payload;
            })
            .addCase(getEmployeeById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Create cases
            .addCase(createEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createEmployee.fulfilled, (state, action) => {
                state.loading = false;
                state.employees.push(action.payload);
            })
            .addCase(createEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update cases
            .addCase(updateEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateEmployee.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.employees.findIndex((emp) => emp.employee_id === action.payload.employee_id);
                if (index !== -1) {
                    state.employees[index] = action.payload;
                }
                state.selectedEmployee = action.payload;
            })
            .addCase(updateEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete cases
            .addCase(deleteEmployee.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteEmployee.fulfilled, (state, action) => {
                state.loading = false;
                // Remove the deleted employee from the list
                state.employees = state.employees.filter((employee) => {
                    return employee.employee_id !== action.payload.employeeId;
                })
            })
            .addCase(deleteEmployee.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
})

export const { clearError } = employeeSlice.actions;
export default employeeSlice.reducer;