import React from 'react';
import useFetch from '../hooks/useFetch';
import { Typography, Box } from '@mui/material';
import Loading from '../components/Loading';
import BackButton from '../components/BackButton';
import styles from '../styles/schedule.module.css';

export default function Schedule() {
    const { data, isLoading } = useFetch('/crawling/schedules');

    const groupedData = data.reduce((acc, cur) => {
        acc[cur.date] = [...(acc[cur.date] || []), cur];
        return acc;
    }, {});

    return (
        <>
            <Box sx={{ paddingLeft: '10px', paddingRight: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <BackButton />
                <Typography component="h1" variant="h5" sx={{ margin: 'auto', fontFamily: 'KBO-Dia-Gothic_medium' }}>
                    경기 일정/결과
                </Typography>
                <div style={{ minWidth: '28px' }}></div>
            </Box>
            {isLoading ? (
                <Loading />
            ) : (
                <div className={styles.scheduleContainer}>
                    <table className={styles.scheduleTable}>
                        <thead>
                            <tr>
                                <th>날짜</th>
                                <th>시간</th>
                                <th>경기</th>
                                <th>구장</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(groupedData).map((date, index) => (
                                <React.Fragment key={index}>
                                    {groupedData[date].map((item, index) => (
                                        <tr key={item.id}>
                                            {index === 0 && (
                                                <td className={styles.dateCell} rowSpan={groupedData[date].length}>
                                                    {date.replace('(', '<br/>(').split('<br/>').map((part, i) => i === 0 ? part : <React.Fragment key={i}><br />{part}</React.Fragment>)}
                                                </td>
                                            )}
                                            {item.remarks === '프로야구 경기가 없습니다.' ? (
                                                <td colSpan="3">{item.remarks}</td>
                                            ) : (
                                                <>
                                                    <td className={styles.timeCell}>{item.time}</td>
                                                    <td>
                                                        <div className={styles.matchCell}>
                                                            <div className={styles.team1Info}>
                                                                <span>{item.team1}</span>
                                                                <img src={item.team1Logo} alt={item.team1} width="24" height="24" />
                                                            </div>
                                                            <div className={styles.score}>{item.score}</div>
                                                            <div className={styles.team2Info}>
                                                                <img src={item.team2Logo} alt={item.team2} width="24" height="24" />
                                                                <span>{item.team2}</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className={styles.stadiumCell}>{item.stadium}</td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}
