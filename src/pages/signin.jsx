import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../auth/user';
import { API_ROUTES, APP_ROUTES } from '../utils/constants';
import axios from 'axios';
import { storeTokenInLocalStorage } from '../auth/auth';

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://www.heinsoe.com/">
                www.heinsoe.com
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

export default function SignInSide() {
    const [message, setMessage]= React.useState(null);
    const navigate = useNavigate();
    const { user, authenticated } = useUser();
    if (user || authenticated) {
        navigate(APP_ROUTES.DASHBOARD)
    }

    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        try {
            setIsLoading(true);
            
            const response = await axios({
                method: 'post',
                url: API_ROUTES.SIGN_IN,
                headers: {
                    // "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                    'Content-Type': 'application/json;charset=utf-8',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                data: {
                    'username':data.get('username'),
                    'password':data.get('password')
                },
                validateStatus: false //to get error status
            });
            if (!response?.data?.token) {
                // console.log('Something went wrong during signing in: ', response);
                setMessage(response.data.message)
                return;
            }
            storeTokenInLocalStorage(response.data.token);
            navigate(APP_ROUTES.DASHBOARD)
        }
        catch (err) {
            console.log('Some error occured during signing in: ', err);
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(https://luminrice.com/assets/images/rice_farming.webp)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                            {message && <Typography>{message}</Typography>}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>

                            <Copyright sx={{ mt: 5 }} />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}