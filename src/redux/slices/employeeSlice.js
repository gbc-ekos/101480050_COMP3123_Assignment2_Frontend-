import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {employeeApi} from "../../api/employeeApi";

export const listEmployees = createAsyncThunk(
    'emp/list',
    async (_, {rejectWithValue}) => {
        try {
            const response = await employeeApi.list();

            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Listing employees failed');
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