import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '../../api/userApi';

export const loginUser = createAsyncThunk(
    'user/loginUser',
    async ({ username, email, password }, { rejectWithValue }) => {
        try {
            const response = await userApi.login(username, email, password);
            const { jwt_token, user } = response.data;

            // Store token in localStorage
            localStorage.setItem('authToken', jwt_token);

            return {
                user,
                jwt_token,
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

export const signup = createAsyncThunk(
    'user/signup',
    async ({ username, email, password }, { rejectWithValue }) => {
        try {
            const response = await userApi.signup(username, email, password);
            const { message } = response.data;

            return {message};
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
                message: error.response?.data?.message || 'Signup failed',
            });
        }
    }
);

export const logoutUser = createAsyncThunk(
    'user/logoutUser',
    async () => {
        await userApi.logout();
        return null;
    }
);

const initialState = {
    id: null,
    username: '',
    email: '',
    token: localStorage.getItem('authToken') || null,
    isAuthenticated: !!localStorage.getItem('authToken'),
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.id = action.payload.user.id;
                state.username = action.payload.user.username;
                state.email = action.payload.user.email;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })
            // Signup cases
            .addCase(signup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signup.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(signup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Logout cases
            .addCase(logoutUser.fulfilled, (state) => {
                state.id = null;
                state.username = '';
                state.email = '';
                state.token = null;
                state.isAuthenticated = false;
                state.error = null;
            });
    },
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;