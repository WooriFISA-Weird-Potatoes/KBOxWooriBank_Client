import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        fontFamily: "'KBO-Dia-Gothic_medium', Arial, sans-serif",
    },
});

const TodaySchedule = ({ game }) => {
    let displayScore;

    if (/^\d{2}:\d{2}$/.test(game.gameTime)) {
        // '18:30'과 같은 날짜 형식인 경우
        displayScore = ' VS ';
    } else if (game.gameTime === '종료' || /\d{1}/.test(game.gameTime)) {
        // '종료' 또는 숫자가 포함된 경우 (예: '3회초')
        displayScore = `${game.team1Score} : ${game.team2Score}`;
    } else {
        // '취소'와 같은 다른 문자열인 경우
        displayScore = game.gameTime;
    }

    return (
        <ThemeProvider theme={theme}>
            <Card sx={{ mt:0.5}}>
                <CardContent sx={{ padding: '7px', '&:last-child': { paddingBottom: '8px' } }}>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <div style={{ display: 'inline-grid', justifyItems: 'center', width: '40%' }}>
                            <Avatar src={game.team1Logo} />
                            <Typography variant="body1">{game.team1Name}</Typography>
                            <Typography variant="body2">
                                <span style={{ color: '#3272ec' }}>{game.team1SPState}</span>{' '}
                                <a target="_blank" rel='noopener noreferrer' href={game.team1SPLink}>
                                    {game.team1SPName}
                                </a>
                            </Typography>
                        </div>
                        <div style={{ display: 'inline-grid', alignContent: 'space-evenly', width: '20%' }}>
                            <Typography variant="h6" align="center">
                                {displayScore}
                            </Typography>
                            <Typography variant="body2" align="center">
                                {game.gameTime}
                            </Typography>
                        </div>
                        <div style={{ display: 'inline-grid', justifyItems: 'center', width: '40%' }}>
                            <Avatar src={game.team2Logo} />
                            <Typography variant="body1">{game.team2Name}</Typography>
                            <Typography variant="body2">
                                <span style={{ color: '#3272ec' }}>{game.team2SPState}</span>{' '}
                                <a target="_blank" rel='noopener noreferrer' href={game.team2SPLink}>
                                    {game.team2SPName}
                                </a>
                            </Typography>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </ThemeProvider>
    );
};

export default TodaySchedule;
