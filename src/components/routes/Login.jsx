import { Button, Container, Stack, TextField, Alert, CircularProgress, Typography } from "@mui/material";
import { Link, useNavigate } from 'react-router-dom';
import Box from "@mui/material/Box";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../redux/slices/userSlice';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, isAuthenticated } = useSelector((state) => state.user);

    // Redirect to home if already authenticated
    if (isAuthenticated) {
        navigate('/', { replace: true });
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            return;
        }

        try {
            const result = await dispatch(loginUser({ username: email, email, password }));

            if (loginUser.fulfilled.match(result)) {
                navigate('/', { replace: true });
            }
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    const handleClearError = () => {
        dispatch(clearError());
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>Login</Typography>
                <Typography color="textSecondary" mb={3}>Sign in to your account</Typography>

                {error && (
                    <Alert severity="error" onClose={handleClearError} sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack gap={2}>
                        <TextField
                            label="Username or Email"
                            variant="outlined"
                            type="text"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            type="password"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            required
                        />
                        <Box display="flex" gap={1}>
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={loading || !email || !password}
                                sx={{ position: 'relative' }}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Login'}
                            </Button>
                            <Link to="/signup" style={{ textDecoration: 'none' }}>
                                <Button variant="outlined" color="secondary">
                                    Sign up
                                </Button>
                            </Link>
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </Container>
    );
}