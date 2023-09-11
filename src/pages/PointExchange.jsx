import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Checkbox, TextField } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Loading from '../components/Loading';
import BackButton from '../components/BackButton';
import useFetch from '../hooks/useFetch';
import useSnackbar from '../hooks/useSnackbar';


export default function PointExchange() {
    const { data, isLoading, fetchData } = useFetch('/point/honeymoney');
    const [showSnackbar, SnackbarComponent] = useSnackbar();
    const [inputValue, setInputValue] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [points, setPoints] = useState(0);

    const handleSubmit = async () => {
        if (inputValue < 100) {
            showSnackbar('포인트는 최소 100 이상이어야 합니다.', 'error');
            return;
        }

        if (inputValue > points) {
            showSnackbar('전환 가능한 포인트를 초과하였습니다.', 'error');
            return;
        }

        try {
            await fetchData('/point/honeymoney', null, 'POST', { point: inputValue });
            showSnackbar('꿀머니 전환 성공!', 'success');
        } catch (error) {
            showSnackbar('전환 가능 포인트를 확인해 주세요', 'error');
        }
    };

    const handleCheckboxClick = () => {
        if (isChecked) {
            setInputValue('');
        } else {
            setInputValue(points);
        }
        setIsChecked(!isChecked);
    };

    useEffect(() => {
        if (data) {
            setPoints(data.point);
        }
    }, [data]);

    return (
        <> {isLoading ? (
            <Loading />
        ) : (
            <Container>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <BackButton />
                    <Typography variant="h5" sx={{ margin: 'auto', fontFamily: 'KBO-Dia-Gothic_medium' }}>
                        나의 포인트
                    </Typography>
                    <div style={{ minWidth: '28px' }}></div>
                </Box>
                <Box my={3} sx={{ backgroundColor: '#f4f4f4', p: 3, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h6" sx={{ fontFamily: 'KBO-Dia-Gothic_medium' }}>전환 가능 포인트</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Typography variant="h6" sx={{ fontFamily: 'KBO-Dia-Gothic_medium' }} >{points}</Typography>
                        <Typography variant="h6" sx={{ ml: 0.5, fontFamily: 'KBO-Dia-Gothic_medium' }}>P</Typography>
                    </Box>
                </Box>
                <Box my={3} sx={{
                    backgroundColor: '#f4f4f4', p: 3, borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                }}>
                    <Typography variant="h6" sx={{ fontFamily: 'KBO-Dia-Gothic_medium', marginBottom: '1rem', textAlign: 'left' }}>
                        전환할 포인트를 입력해주세요
                    </Typography>
                    <Box sx={{
                        display: 'flex', alignItems: 'center', width: '100%'
                    }}>
                        <img
                            src='https://play-lh.googleusercontent.com/X0F73sNd54RPhUJCMlRAINxhGKxw18jkBgw4E5F6dIs_7pL5Geg0xWt5taQwisw47ok=w240-h480-rw'
                            alt=''
                            width='30'
                            height='30'
                            style={{ borderRadius: '50%' }}
                        />
                        <TextField
                            id="input-with-sx"
                            label=""
                            variant="standard"
                            sx={{ flexGrow: 1, marginLeft: 1 }}
                            value={inputValue}
                            onChange={(e) => {
                                const re = /^[0-9\b]+$/;
                                if (e.target.value === '' || re.test(e.target.value)) {
                                    setInputValue(e.target.value);
                                }
                            }}
                            autoComplete="off"
                            inputProps={{ inputMode: 'numeric' }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Checkbox
                            icon={<CheckCircleIcon />}
                            checkedIcon={<CheckCircleIcon />}
                            checked={isChecked}
                            onChange={handleCheckboxClick}
                            borderradius='50%'
                        />
                        <Typography variant="body2" sx={{ fontFamily: 'KBO-Dia-Gothic_light', cursor: 'pointer' }} onClick={handleCheckboxClick}>
                            포인트 전체 사용
                        </Typography>
                    </Box>
                    <SnackbarComponent />
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{
                        fontFamily: 'KBO-Dia-Gothic_medium',
                        width: '100%', position: 'relative', bottom: '0px',
                    }}
                >
                    전환하기
                </Button>
            </Container>
        )}
        </>
    );
}