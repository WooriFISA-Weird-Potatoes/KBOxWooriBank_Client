import React, { useEffect, useState } from 'react';
import { Container, Dialog, DialogContent, Button, Grid, Box, TextField, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import DaumPostCode from '../components/DaumPostcode';
import Loading from '../components/Loading';
import useFetch from '../hooks/useFetch';

const defaultTheme = createTheme({
    typography: {
        fontFamily: 'KBO-Dia-Gothic_light',
    },
});

export default function Winner() {
    const navigate = useNavigate();
    const location = useLocation();
    const eventId = location.state?.eventId;
    const { data: userInfo, isLoading } = useFetch('/users');
    const { fetchData } = useFetch(`/events/${eventId}`);
    const [address, setAddress] = useState('');
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const onSubmit = async (data) => {
        data.addr = address;
        try {
            await fetchData(`/events/${eventId}/addr`, null, 'POST', { addr: address });
            alert('배송지 정보가 입력되었어요');
            navigate('/mypage');
        } catch (error) {
            alert('잠시후 다시 시도해주세요.');
        }
    };

    useEffect(() => {
        if (userInfo) {
            setAddress(userInfo.addr);
        }
    }, [userInfo]);

    return (
        <>{isLoading ? (
            <Loading />
        ) : (
            <ThemeProvider theme={defaultTheme}>
                <Container >
                    <Box sx={{ mt: 1, borderRadius: '12px', textAlign: 'center' }}>
                        <Typography variant="h5" sx={{ mb: 2, fontFamily: 'KBO-Dia-Gothic_medium' }}>
                            알림
                        </Typography>
                        {isLoading ? (
                            <Loading />
                        ) : (
                            <Box>
                                <Typography component="h1" variant="h5" sx={{ mb: 2, fontFamily: 'KBO-Dia-Gothic_medium', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    축하합니다!
                                    <img src='https://blog.kakaocdn.net/dn/byuzXG/btrulTxSVDi/ad3chlzkY1KXHKmpON4Kb0/img.png' alt='' style={{ width: '50%' }} />
                                </Typography>
                                <Typography my={5} sx={{ ml: 2, textAlign: 'left' }}>
                                    아래 주소가 맞나요? <br />
                                    아닐 경우 다시 입력해 주세요
                                </Typography>
                                <Grid container item xs={12} spacing={0.5}>
                                    <Grid item xs={9.5}>
                                        <TextField
                                            sx={{ height: '100%' }}
                                            onChange={(e) => setAddress(e.target.value)}
                                            autoComplete="off"
                                            required
                                            fullWidth
                                            id="addr"
                                            label="주소"
                                            name="addr"
                                            value={address}
                                        />
                                    </Grid>
                                    <Grid item xs={2.5}>
                                        <Button sx={{ height: '100%' }} variant="outlined" color="primary" onClick={handleClickOpen}>
                                            검색
                                        </Button>
                                        <Dialog open={open} onClose={handleClose}>
                                            <DialogContent>
                                                <DaumPostCode setAddress={setAddress} handleClose={handleClose} />
                                            </DialogContent>
                                        </Dialog>
                                    </Grid>
                                </Grid>
                                <Box mt={3}>
                                    <Button variant="contained" color="primary" onClick={() => onSubmit({})}>
                                        확{' '}인
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Container>
            </ThemeProvider>
        )}
        </>
    );
}