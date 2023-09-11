import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Typography, Avatar, createTheme, Paper, ThemeProvider } from '@mui/material';
import { useUser, setUser } from '../contexts/UserContext';
import styles from '../styles/prediction.module.css';
import useSnackbar from '../hooks/useSnackbar';
import api from '../util/api';

const defaultTheme = createTheme({
    typography: {
        fontFamily: 'KBO-Dia-Gothic_light',
    },
});

export default function Prediction() {
    const { user, setUser } = useUser();
    const [games, setGames] = useState([]);
    const [rankings, setRankings] = useState([]);
    const [selectedTeams, setSelectedTeams] = useState({});
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
    const [isEnded, setIsEnded] = useState(false);
    const [showSnackbar, SnackbarComponent] = useSnackbar();

    const isLoggedIn = Boolean(user);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/crawling/main/schedules')
            .then((response) => {
                setGames(response.data.data);
            })
            .catch((error) => {
            });
    }, []);

    useEffect(() => {
        api.get('/crawling/main/rankings')
            .then((response) => {
                setRankings(response.data.data);
            })
            .catch((error) => {
            });
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            api.get('/predictions')
                .then((response) => {
                    setIsEnded(response.data.data.isEnded);
                    const { participated, predictions } = response.data.data;
                    if (participated) {
                        const newSelectedTeams = {};
                        games.forEach((game, index) => {
                            newSelectedTeams[game.id] = predictions[index];
                        });
                        setSelectedTeams(newSelectedTeams);
                        setIsSubmitEnabled(true);
                    }
                })
                .catch((error) => {
                });
        }
    }, [games, isLoggedIn]);

    const handleTeamSelect = (gameId, team) => {
        setSelectedTeams({ ...selectedTeams, [gameId]: team });

        if (Object.keys(selectedTeams).length === games.length - 1) {
            setIsSubmitEnabled(true);
        }
    };

    const handleSubmit = () => {
        const selectedTeamsArray = Object.values(selectedTeams);
        const payload = {
            predictions: selectedTeamsArray,
        };

        api.post('/predictions', payload)
            .then((response) => {
                showSnackbar('제출 완료!', 'success');
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
                <div>
                    <Typography variant="h5" gutterBottom className={styles.titleTypography}>
                        오늘의 승리팀을 맞춰주세요!
                    </Typography>
                    <Card className={styles.gameCard}>
                        <Typography variant="h6" gutterBottom>
                            {games.at(0)?.date}
                        </Typography>
                        {/* 취소일 때 버튼 클릭 안되게 처리 (취소됐으면 cancelled 등을 넘겨야 함)*/}
                        {games.map((game) => (
                            <Card key={game.id} style={{ margin: '10px', width: '100%', borderRadius: '10px' }}>
                                <Paper sx={{ padding: '0.5em' }}>
                                    {/* <Typography variant="h6">{`경기 ${game.id}`}</Typography> */}
                                    <div className={styles.game}>
                                        <div className={styles.club}>
                                            <Button
                                                variant={selectedTeams[game.id] === game.team1Name ? 'contained' : ''}
                                                onClick={() => handleTeamSelect(game.id, game.team1Name)}
                                                style={{ padding: '0' }}
                                            >
                                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                                                    <div>
                                                        <Avatar src={game.team1Logo} />
                                                        <Typography variant="body1">
                                                            <b>{game.team1Name}</b>
                                                        </Typography>
                                                    </div>
                                                    <Typography variant="body2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                                        <span style={{ margin: '0', display: 'block' }}>{rankings.filter((ranking) => ranking.teamName === game.team1Name).at(0)?.rank}위</span>
                                                        <span>
                                                            <span style={{ color: '#d32f2f', paddingRight: '3px' }}>{game.team1SPState}</span>
                                                            {game.team1SPName}
                                                        </span>
                                                    </Typography>
                                                </div>
                                            </Button>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography variant="h6" align="center" sx={{ padding: '0 10px' }}>
                                                VS
                                            </Typography>
                                            <span style={{ fontSize: 'x-small', fontWeight: 'bold' }}>{game.gameTime}</span>
                                        </div>
                                        <div className={styles.club}>
                                            <Button
                                                variant={selectedTeams[game.id] === game.team2Name ? 'contained' : ''}
                                                onClick={() => handleTeamSelect(game.id, game.team2Name)}
                                                style={{ padding: '0' }}
                                            >
                                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                                                    <Typography variant="body2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                                        <span style={{ margin: '0', display: 'block' }}>{rankings.filter((ranking) => ranking.teamName === game.team2Name).at(0)?.rank}위</span>
                                                        <span>
                                                            <span style={{ color: '#d32f2f', paddingRight: '3px' }}>{game.team2SPState}</span>
                                                            {game.team2SPName}
                                                        </span>
                                                    </Typography>
                                                    <div>
                                                        <Avatar src={game.team2Logo} />
                                                        <Typography variant="body1">
                                                            <b>{game.team2Name}</b>
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </Button>
                                        </div>
                                    </div>
                                </Paper>
                            </Card>
                        ))}
                    </Card>
                    {isEnded ? (
                        <Button variant="contained" color="primary" disabled style={{ margin: '4em 0', padding: '0.5em 2em' }}>
                            예측 종료
                        </Button>
                    ) : (
                        <Button variant="contained" color="primary" disabled={!isSubmitEnabled} onClick={handleSubmit} style={{ margin: '4em 0', padding: '0.5em 2em' }}>
                            제출하기
                        </Button>
                    )}
                </div>
                <SnackbarComponent />
            </ThemeProvider>
        </>
    );
}
