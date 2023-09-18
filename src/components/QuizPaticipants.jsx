import React, { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, CartesianGrid, Tooltip } from 'recharts';
import Title from './Title';
import Loading from './Loading';
import useFetch from '../hooks/useFetch';

export default function Chart() {
    const theme = useTheme();
    const {
        data: weeklyQuizData,
        isLoading: isLoadingWeekly,
        error: errorWeekly,
        refetch: refetchWeeklyQuizData,
    } = useFetch('/admin/quiz/weekly');
    const {
        data: monthlyQuizData,
        isLoading: isLoadingMonthly,
        error: errorMonthly,
        refetch: refetchMonthlyQuizData,
    } = useFetch('/admin/quiz/monthly');

    useEffect(() => {
        refetchWeeklyQuizData(); // 주간 데이터 다시 불러오기
        refetchMonthlyQuizData(); // 월간 데이터 다시 불러오기
    }, [window.location.pathname]);

    if (isLoadingWeekly || isLoadingMonthly) {
        return <div><Loading /></div>;
    }

    if (errorWeekly || errorMonthly) {
        return <div>Error: 데이터를 불러올 수 없습니다.</div>;
    }

    const tooltipFormatter = (value, name) => [`${value}명`, '총 참여 회원수'];

    return (
        <React.Fragment>
            <Title>주간 퀴즈 참여자 수</Title>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={weeklyQuizData}
                    margin={{
                        top: 16,
                        right: 16,
                        bottom: 0,
                        left: 24,
                    }}
                >
                    <XAxis
                        dataKey="createdAt"
                        stroke={theme.palette.text.secondary}
                        style={theme.typography.body2}
                    />
                    <YAxis
                        dataKey="quizParticipants"
                        stroke={theme.palette.text.secondary}
                        style={theme.typography.body2}
                    >
                        <Label
                            angle={270}
                            position="left"
                            style={{
                                textAnchor: 'middle',
                                fill: theme.palette.text.primary,
                                ...theme.typography.body1,
                            }}
                        >
                            총 참여 회원수(명)
                        </Label>
                    </YAxis>
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <Line
                        isAnimationActive={true}
                        type="monotone"
                        dataKey="quizParticipants"
                        stroke="#8884d8"
                        dot={false}
                    />
                    <Tooltip formatter={tooltipFormatter} />
                </LineChart>
            </ResponsiveContainer>

            <Title>월간 퀴즈 참여자 수</Title>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={monthlyQuizData}
                    margin={{
                        top: 16,
                        right: 16,
                        bottom: 0,
                        left: 24,
                    }}
                >
                    <XAxis
                        dataKey="createdAt"
                        stroke={theme.palette.text.secondary}
                        style={theme.typography.body2}
                    />
                    <YAxis
                        dataKey="quizParticipants"
                        stroke={theme.palette.text.secondary}
                        style={theme.typography.body2}
                    >
                        <Label
                            angle={270}
                            position="left"
                            style={{
                                textAnchor: 'middle',
                                fill: theme.palette.text.primary,
                                ...theme.typography.body1,
                            }}
                        >
                            총 참여 회원수(명)
                        </Label>
                    </YAxis>
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                    <Line
                        isAnimationActive={true}
                        type="monotone"
                        dataKey="quizParticipants"
                        stroke={theme.palette.primary.main}
                        dot={false}
                    />
                    <Tooltip formatter={tooltipFormatter} />
                </LineChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
}