import Box from "@mui/material/Box";
import {Alert, Button, CircularProgress, Container, Stack, TextField, Typography} from "@mui/material";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {clearError, signup} from "../../redux/slices/userSlice";

export default function Signup() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {loading, error} = useSelector((state) => state.user);

    // Extract field errors and general message
    const fieldErrors = typeof error === 'object' && error?.fieldErrors ? error.fieldErrors : {};
    const errorMessage = typeof error === 'object' && error?.message ? error.message : error;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password || !username) {
            return;
        }

        try {
            const result = await dispatch(signup({username, email, password}));

            if (signup.fulfilled.match(result)) {
                navigate('/login', { replace: true });
            }
        } catch (err) {
            console.error('Signup error:', err);
        }
    };

    const handleClearError = () => {
        dispatch(clearError());
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{mt: 8, mb: 4}}>
                <Typography variant="h4" component="h1" gutterBottom>Sign up</Typography>
                <Typography color="textSecondary" mb={3}>Create an account</Typography>

                {errorMessage && (
                    <Alert severity="error" onClose={handleClearError} sx={{mb: 2}}>
                        {errorMessage}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Stack gap={2}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            type="text"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={loading}
                            required
                            error={!!fieldErrors.username}
                            helperText={fieldErrors.username}
                        />
                        <TextField
                            label="Email"
                            variant="outlined"
                            type="email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                            error={!!fieldErrors.email}
                            helperText={fieldErrors.email}
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
                            error={!!fieldErrors.password}
                            helperText={fieldErrors.password}
                        />
                        <Box display="flex" gap={1}>
                            <Button
                                variant="contained"
                                type="submit"
                                disabled={loading || !email || !password}
                                sx={{position: 'relative'}}
                            >
                                {loading ? <CircularProgress size={24}/> : 'Sign up'}
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </Container>
    )
}