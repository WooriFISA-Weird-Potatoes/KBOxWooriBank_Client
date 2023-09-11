import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import useSnackbar from '../hooks/useSnackbar';
import styles from '../styles/event.module.css';
import eventImg from '../assets/event.png';
import api from '../util/api';

const defaultTheme = createTheme({
    typography: {
        fontFamily: 'KBO-Dia-Gothic_light',
    },
});

export default function Event() {
    const navigate = useNavigate();
    const [timeLeft, setTimeLeft] = useState('');
    const [events, setEvents] = useState([]);
    const [isEnded, setIsEnded] = useState(false);
    const [eventStartTime, setEventStartTime] = useState(null);
    const [showSnackbar, SnackbarComponent] = useSnackbar();
    const [isWooriLinked, setIsWooriLinked] = useState(false);
    const [isEventStarted, setIsEventStarted] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = new Date();
            const eventStart = new Date(eventStartTime).getTime();
            const timeDifference = eventStart - now.getTime();

            if (timeDifference < 0) {
                setTimeLeft('00시간 00분 00초');
            } else {
                const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

                const formattedHours = String(hours).padStart(2, '0');
                const formattedMinutes = String(minutes).padStart(2, '0');
                const formattedSeconds = String(seconds).padStart(2, '0');

                setTimeLeft(`${formattedHours}시간 ${formattedMinutes}분 ${formattedSeconds}초`);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [eventStartTime]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedIsWooriLinked = sessionStorage.getItem('isWooriLinked');

                if (storedIsWooriLinked !== null) {
                    setIsWooriLinked(storedIsWooriLinked === 'true');
                }

                const response = await api.get('/events');
                const eventData = response.data.data;
                const eventEnded = eventData.isEnded;
                const eventTime = eventData.startDate;

                setEvents(eventData);
                setIsEnded(eventEnded);
                setEventStartTime(eventTime);

                const now = new Date();
                if (eventTime) {
                    const eventStart = new Date(eventTime);
                    if (now >= eventStart) {
                        setIsEventStarted(true);
                    } else {
                        setIsEventStarted(false);
                    }
                }
            } catch (error) {}
        };

        fetchData();
    }, []);

    // useEffect(() => {
    //     if (isWooriLinked) {
    //         showSnackbar('우리은행 연동 확인 완료!', 'success');
    //     }
    // }, [isWooriLinked]);

    const handleBankVerification = () => {
        // 우리은행 연동 확인 로직
        api.get('/users/woori')
            .then((response) => {
                setIsWooriLinked(true);
                sessionStorage.setItem('isWooriLinked', 'true');
                alert('우리은행 연동 확인 완료!');
            })
            .catch((error) => {
                setIsWooriLinked(false);
                sessionStorage.setItem('isWooriLinked', 'false');
                if (error.response.status === 400) {
                    navigate('/mypage');
                } else if (error.response.status === 401) {
                    navigate('/login');
                }
            });
    };

    const handleParticipation = () => {
        // 참여하기 로직
        api.post(`/events/${events?.id}`)
            .then((response) => {
                showSnackbar('이벤트 응모 성공!', 'success');
            })
            .catch((error) => {
                const status = error.response.data.status;
                showSnackbar(error.response.data.message, 'error');
                if (status === 1301) {
                    setIsWooriLinked(false);
                } else if (status === 1303) {
                    setIsEnded(true);
                }
            });
    };

    return (
        <>
            <ThemeProvider theme={defaultTheme}>
                <Container sx={{ padding: 0 }}>
                    <Paper elevation={3} style={{ textAlign: 'center', backgroundColor: '#573F00', borderRadius: 0 }}>
                        {/* 이벤트 이미지 */}
                        <img src={eventImg} alt="Event" style={{ width: '100%' }} />

                        {/* 이벤트까지 남은 시간 */}
                        <div className={styles.container}>
                            <div className={styles.clock}>
                                <h1 id="time" style={{ padding: '0.4em' }}>
                                    <p style={{ marginBottom: '0.3em', marginTop: '0.1em', fontSize: '0.8em' }}>이벤트 시작까지</p>
                                    {timeLeft}
                                </h1>
                            </div>
                        </div>

                        <Container sx={{ display: 'flex', flexDirection: 'column', padding: '2em', paddingTop: '1em' }}>
                            <Button variant="contained" onClick={handleBankVerification} style={{ margin: '10px' }}>
                                우리은행 연동 확인
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleParticipation}
                                disabled={!isWooriLinked || isEnded || !isEventStarted}
                                style={{ margin: '10px', backgroundColor: '#A91C25' }}
                                sx={{ '&.Mui-disabled': { backgroundColor: 'gray !important' } }}
                            >
                                참여하기
                            </Button>
                        </Container>
                    </Paper>
                </Container>
                <SnackbarComponent />
            </ThemeProvider>
        </>
    );
}