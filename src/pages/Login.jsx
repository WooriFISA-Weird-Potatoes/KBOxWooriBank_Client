import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Button, CssBaseline, TextField, Grid, Box, Typography, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useSnackbar from '../hooks/useSnackbar';
import api from '../util/api';

const defaultTheme = createTheme({
    typography: {
        fontFamily: 'KBO-Dia-Gothic_light',
    },
});

export default function SignIn() {
    const navigate = useNavigate();
    const { setUser } = useUser();
    const [showSnackbar, SnackbarComponent] = useSnackbar();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const userId = data.get('userId');
        const password = data.get('password');

        try {
            const response = await api.post('/auth/login', {
                userId,
                password,
            });

            if (response.data.success) {
                const { accessToken, refreshToken } = response.data.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                setUser({ id: userId, accessToken, refreshToken });

                const role = await api.get('/users/role');
                if (role.data.data.role === 'ROLE_ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                navigate('/login');
            }
        } catch (error) {
            showSnackbar('아이디 또는 비밀번호를 확인해주세요.', 'error');
        }
    };
    const handleSignUpClick = () => {
        navigate('/signup');
    };

    return (
        <>
            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography component="h1" variant="h5" style={{ fontFamily: 'KBO-Dia-Gothic_medium' }}>
                            로그인
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField margin="normal" required fullWidth id="userId" label="아이디를 입력하세요." name="userId" autoComplete="userId" autoFocus />
                            <TextField margin="normal" required fullWidth name="password" label="비밀번호를 입력하세요." type="password" id="password" autoComplete="current-password" />
                            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, fontFamily: 'KBO-Dia-Gothic_medium', height: '3em' }}>
                                로그인
                            </Button>
                            <Grid container item xs={12} spacing={0.5}>
                                <Grid item xs={9.5} sx={{ textDecoration: 'underline', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                    <Typography variant="body2">아직 회원이 아니신가요?</Typography>
                                </Grid>
                                <Grid item xs={2.5}>
                                    <Button
                                        onClick={handleSignUpClick}
                                        fullWidth
                                        variant="text"
                                        sx={{ mt: 2, mb: 2, fontFamily: 'KBO-Dia-Gothic_medium' }}
                                    >
                                        회원가입
                                    </Button>
                                    <SnackbarComponent />
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        </>
    );
}
