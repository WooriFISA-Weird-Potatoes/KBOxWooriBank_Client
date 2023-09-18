import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSnackbar from '../hooks/useSnackbar';
import { useUser } from '../contexts/UserContext';
import Loading from '../components/Loading';
import { Button, Card, createTheme, Paper, ThemeProvider } from '@mui/material';
import styles from '../styles/quiz.module.css';
import api from '../util/api';

const defaultTheme = createTheme({
    typography: {
        fontFamily: 'KBO-Dia-Gothic_light',
    },
});

export default function Quiz() {
    const { user } = useUser();
    const [quiz, setQuiz] = useState(null);
    const [selectedOption, setSelectedOption] = useState(null);
    const [participation, setParticipation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showSnackbar, SnackbarComponent] = useSnackbar();

    const isLoggedIn = Boolean(user);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        api.get('/quizzes')
            .then((response) => {
                setQuiz(response.data.data);
            })
            .catch((error) => {
            })
            .finally(() => {
                setIsLoading(false); // 로딩 완료
            });
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            setIsLoading(true);
            api.get(`/quizzes/${quiz?.id}`)
                .then((response) => {
                    setParticipation(response.data.data.hasParticipated);
                })
                .catch((error) => {
                })
                .finally(() => {
                    setIsLoading(false); // 로딩 완료
                });
        }
    }, [quiz?.id]);

    const handleSubmit = () => {
        if (participation) {
            alert('이미 참여하셨습니다.');
            return;
        }

        const payload = {
            quizId: quiz?.id,
            choice: String(selectedOption + 1),
        };

        api.post(`/quizzes/${quiz?.id}`, payload)
            .then((response) => {
                if (response.data.data.correct) {
                    setParticipation(true);
                    showSnackbar('정답입니다!', 'success');
                } else {
                    showSnackbar('오답입니다! 다시 시도해주세요.', 'warning');
                }
            })
            .catch((error) => {
                const status = error.response.data.status;
                if (status === 1100) {
                    navigate('/login');
                }
            });
    };

    return (
        <>
            <ThemeProvider theme={defaultTheme}>
                {isLoading ? (
                    <Loading />
                ) : (
                    <>
                        {quiz ? (
                            <div>
                                <h1 className={styles.title}>오늘의 퀴즈</h1>
                                <Card className={styles.quizCard}>
                                    <p className={styles.question}>
                                        <span style={{ fontSize: 'x-large' }}>Q.</span> <span>{quiz?.question}</span>
                                    </p>
                                    {['choice1', 'choice2', 'choice3', 'choice4'].map((choice, index) => (
                                        <Card key={index} style={{ margin: '10px', width: '100%', borderRadius: '0' }}>
                                            <Paper sx={{ padding: '0.5em', borderRadius: '0' }}>
                                                <div className={styles.game}>
                                                    <div className={styles.club}>
                                                        <Button key={index} className={styles.choiceButton} variant={selectedOption === index ? 'contained' : ''} onClick={() => setSelectedOption(index)}>
                                                            {quiz?.[choice]}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </Paper>
                                        </Card>
                                    ))}
                                </Card>
                                <br />
                                {participation ? (
                                    <Button variant="contained" disabled style={{ margin: '3em 0', padding: '0.5em 2em' }}>
                                        참여 완료
                                    </Button>
                                ) : (
                                    <Button variant="contained" color="primary" onClick={handleSubmit} style={{ margin: '3em 0', padding: '0.5em 2em' }}>
                                        제출하기
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div>
                                <h1 className={styles.title}>오늘의 퀴즈가 없습니다</h1>
                                <h2>내일 다시 찾아와주세요!</h2>
                            </div>
                        )}
                        <SnackbarComponent />
                    </>)}
            </ThemeProvider>
        </>
    );
}